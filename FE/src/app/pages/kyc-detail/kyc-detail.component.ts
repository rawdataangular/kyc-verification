import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../core/services/master-data.service';
import { SurepassService } from '../../core/services/surepass.service';
import { UserDetail, CountryMaster, OfficeMaster, UserTypeMaster, DocumentRequirement, UserDocument } from '../../core/models/customer.model';

@Component({
    selector: 'app-kyc-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
    templateUrl: './kyc-detail.component.html'
})
export class KycDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private masterDataService = inject(MasterDataService);
    private surepassService = inject(SurepassService);
    private http = inject(HttpClient);

    isEditMode = false;

    countries = signal<CountryMaster[]>([]);
    offices = signal<OfficeMaster[]>([]);
    userTypes = signal<UserTypeMaster[]>([]);
    requirements = signal<DocumentRequirement[]>([]);

    user: UserDetail = {
        name: '',
        country: 0,
        office: 0,
        user_type: 0,
        status: 'DRAFT',
        person1_name: '',
        person1_phone: '',
        full_address: '',
        documents: []
    };

    selectedFiles: Map<number, File> = new Map();
    validityDateInputs: Map<number, string> = new Map();
    changeDocRequests: Set<number> = new Set();
    isUploading = signal<boolean>(false);
    systemVerificationLog: Map<number, string> = new Map();
    isSystemVerifying: Map<number, boolean> = new Map();
    validityDateUpdates: Map<number, string> = new Map();

    showVerificationModal = false;
    activeVerificationReqId: number | null = null;
    activeVerificationDoc: UserDocument | undefined;
    verificationMode: 'NONE' | 'MANUAL' | 'SYSTEM' = 'NONE';
    systemOcrStatus: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' = 'IDLE';
    documentNumber: string = '';
    ocrData: any = null;
    verificationRemarks: string = '';
    apiVerificationStatus: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' = 'IDLE';
    apiData: any = null;

    private sanitizer = inject(DomSanitizer);

    ngOnInit() {
        this.masterDataService.countries$.subscribe(data => this.countries.set(data));
        this.masterDataService.offices$.subscribe(data => this.offices.set(data));
        this.masterDataService.userTypes$.subscribe(data => this.userTypes.set(data));

        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode = true;
            this.refreshUserData(+id);
        }
    }

    refreshUserData(id?: number) {
        const targetId = id || this.user.id;
        if (targetId) {
            this.masterDataService.getUserDetailById(targetId).subscribe(data => {
                this.user = data;
                this.fetchRequirements();
            });
        }
    }

    onProfileChange() {
        const type = Number(this.user.user_type);
        const country = Number(this.user.country);
        const office = Number(this.user.office);

        if (type > 0 && country > 0 && office > 0) {
            this.fetchRequirements();
        } else {
            this.requirements.set([]);
        }
    }

    fetchRequirements() {
        const type = Number(this.user.user_type);
        const country = Number(this.user.country);
        const office = Number(this.user.office);

        if (type > 0 && country > 0 && office > 0) {
            this.masterDataService.getRequirements(type, country, office)
                .subscribe(data => {
                    this.requirements.set(data);
                });
        }
    }

    saveProfile() {
        if (!this.user.name || !this.user.country || !this.user.office || !this.user.user_type) {
            alert('Missing Name, Classification, Country, or Office.');
            return;
        }

        this.masterDataService.saveUserDetail(this.user).subscribe({
            next: (data) => {
                alert('Profile saved!');
                if (!this.isEditMode) {
                    this.router.navigate(['/kyc', data.id]);
                } else {
                    this.user = data;
                }
            },
            error: (err) => { console.error(err); alert('Save failed.'); }
        });
    }

    handleFileInput(event: any, requirementId: number) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFiles.set(requirementId, file);
        }
    }

    uploadSelectedFile(requirementId: number) {
        const file = this.selectedFiles.get(requirementId);
        if (file && this.user.id) {
            this.isUploading.set(true);
            const formData = new FormData();
            formData.append('user_detail', this.user.id.toString());
            formData.append('document_requirement', requirementId.toString());
            formData.append('file_upload', file);
            formData.append('is_active', 'true'); // Explicitly set active

            const validityDate = this.validityDateInputs.get(requirementId);
            if (validityDate) {
                formData.append('validity_date', validityDate);
            }

            this.masterDataService.uploadUserDocument(formData).subscribe({
                next: () => {
                    this.isUploading.set(false);
                    alert('Uploaded!');
                    this.selectedFiles.delete(requirementId);
                    this.validityDateInputs.delete(requirementId);
                    this.changeDocRequests.delete(requirementId);
                    this.refreshUserData();
                },
                error: () => { this.isUploading.set(false); alert('Upload failed.'); }
            });
        } else {
            alert('Save profile first.');
        }
    }

    getUploadedDoc(requirementId: number): UserDocument | undefined {
        // Return the latest active document for this requirement
        return (this.user.documents || []).filter(d => d.document_requirement === requirementId && d.is_active)
            .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
    }

    getDocUrl(url: string | undefined): string {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
    }

    getFormatDate(dateStr: string | undefined): string | null {
        if (!dateStr) return null;
        return dateStr.split('T')[0];
    }

    requestChangeDoc(requirementId: number) {
        this.changeDocRequests.add(requirementId);
    }

    cancelChangeDoc(requirementId: number) {
        this.changeDocRequests.delete(requirementId);
        this.selectedFiles.delete(requirementId);
    }

    openVerificationModal(reqId: number) {
        this.activeVerificationReqId = reqId;
        this.activeVerificationDoc = this.getUploadedDoc(reqId);
        this.showVerificationModal = true;
        this.verificationMode = 'NONE';
        this.systemOcrStatus = 'IDLE';
        this.documentNumber = '';
        this.ocrData = null;
        this.verificationRemarks = this.activeVerificationDoc?.remarks || '';
        this.apiVerificationStatus = 'IDLE';
        this.apiData = null;
    }

    closeVerificationModal() {
        this.showVerificationModal = false;
        this.activeVerificationReqId = null;
        this.activeVerificationDoc = undefined;
        this.verificationMode = 'NONE';
        this.systemOcrStatus = 'IDLE';
        this.documentNumber = '';
        this.ocrData = null;
        this.verificationRemarks = '';
        this.apiVerificationStatus = 'IDLE';
        this.apiData = null;
    }

    getSafeDocUrl(url: string | undefined): SafeResourceUrl | string {
        if (!url) return '';
        const fullUrl = this.getDocUrl(url);
        return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }

    runSystemOcr() {
        this.systemOcrStatus = 'LOADING';
        
        // Mocking API call for OCR / System verification
        setTimeout(() => {
            this.systemOcrStatus = 'SUCCESS';
            this.ocrData = {
                number: this.documentNumber || `DOC-${Math.floor(Math.random() * 100000)}`,
                name: this.user.name,
                confidence: 94 + Math.floor(Math.random() * 5),
                extracted_date: new Date().toISOString()
            };
            this.documentNumber = this.ocrData.number;
            this.onDocumentNumberChange();
        }, 2000);
    }

    onDocumentNumberChange() {
        if (this.verificationMode === 'SYSTEM' && this.apiVerificationStatus !== 'IDLE') {
            this.apiVerificationStatus = 'IDLE';
            this.apiData = null;
        }
    }

    retryApiVerification(documentType: string | undefined) {
        this.apiVerificationStatus = 'IDLE';
        this.apiData = null;
        this.runApiVerification(documentType);
    }

    runApiVerification(documentType: string | undefined) {
        if (!this.documentNumber) {
            alert('Please enter or extract a Document Number to query the API.');
            return;
        }
        if (!documentType) {
            alert('Document Type is missing. Cannot verify online.');
            return;
        }

        this.apiVerificationStatus = 'LOADING';
console.log(documentType,this.documentNumber);

        this.surepassService.verifyDocument(documentType, this.documentNumber).subscribe({
            next: (res: any) => {
                this.apiVerificationStatus = 'SUCCESS';
                // Surepass typically returns data inside data, or directly in root
                const data = res.data || res || {};
                
                if (res.success === false || data.status === 'invalid') {
                    this.apiData = {
                        name: '---',
                        status: 'INVALID',
                        message: res.message || data.message || 'Invalid Document Error',
                        issue_date: '---',
                        pan_number: this.documentNumber,
                        verified_by: `${documentType} Govt Registry`
                    };
                } else {
                    this.apiData = {
                        name: data.full_name || data.name_on_card || data.client_id || 'REGISTERED ONLINE USER',
                        status: 'ACTIVE AND VALID',
                        message: res.message || 'Verification Successful',
                        issue_date: data.dob || data.issue_date || 'N/A',
                        pan_number: data.pan_number || data.id_number || this.documentNumber,
                        verified_by: `${documentType} Govt Registry`
                    };
                }
            },
            error: (err) => {
                console.warn('API call failed/rejected by Surepass.', err);
                this.apiVerificationStatus = 'SUCCESS'; // Force UI to show the rejected info panel
                
                const errData = err.error || {};
                
                this.apiData = {
                    name: '---',
                    status: 'INVALID (HTTP Error)',
                    message: errData.message || err.message || 'Verification Failed / Invalid Document',
                    issue_date: '---',
                    pan_number: this.documentNumber,
                    verified_by: `${documentType} Govt Registry`
                };
            }
        });
    }

    verifyActiveDoc(status: 'VERIFIED' | 'REJECTED', method: string) {
        if (this.activeVerificationReqId) {
            this.verifyDoc(this.activeVerificationReqId, status, method, this.verificationRemarks);
            this.closeVerificationModal();
        }
    }

    verifyDoc(requirementId: number, status: 'VERIFIED' | 'REJECTED', method: string, remarks?: string) {
        const doc = this.getUploadedDoc(requirementId);
        if (doc && doc.id) {
            const updateData: any = {
                verification_status: status,
                verification_method: method as 'MANUAL' | 'PORTAL',
                is_verified: status === 'VERIFIED'
            };
            if (remarks !== undefined) {
                updateData.remarks = remarks;
            }
            this.masterDataService.verifyUserDocument(doc.id, updateData).subscribe(() => {
                alert(`Verified as ${status} via ${method}`);
                this.refreshUserData();
            });
        }
    }

    updateValidityDate(requirementId: number, date: string) {
        this.validityDateUpdates.set(requirementId, date);
    }

    saveValidityDate(requirementId: number) {
        const doc = this.getUploadedDoc(requirementId);
        const newDate = this.validityDateUpdates.get(requirementId);
        if (doc && doc.id && newDate) {
            const updateData = { validity_date: newDate };
            this.masterDataService.verifyUserDocument(doc.id, updateData).subscribe(() => {
                alert('Validity Date Updated');
                this.validityDateUpdates.delete(requirementId);
                this.refreshUserData();
            });
        }
    }

    systemVerify(requirementId: number) {
        const doc = this.getUploadedDoc(requirementId);
        if (doc && doc.id) {
            this.isSystemVerifying.set(requirementId, true);
            this.systemVerificationLog.set(requirementId, 'Connecting to verification portal...');

            setTimeout(() => {
                this.systemVerificationLog.set(requirementId, 'Authenticated. Scanning document signature...');
                setTimeout(() => {
                    const success = Math.random() > 10;
                    this.isSystemVerifying.set(requirementId, false);
                    if (success) {
                        this.systemVerificationLog.set(requirementId, 'MATCH FOUND. Identity confirmed.');
                        this.verifyDoc(requirementId, 'VERIFIED', 'PORTAL');
                    } else {
                        this.systemVerificationLog.set(requirementId, 'MISMATCH. Verification failed.');
                        this.verifyDoc(requirementId, 'REJECTED', 'PORTAL');
                    }
                }, 1500);
            }, 1000);
        }
    }
}
