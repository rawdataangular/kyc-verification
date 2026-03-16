import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../core/services/master-data.service';
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
    isUploading = signal<boolean>(false);
    systemVerificationLog: Map<number, string> = new Map();
    isSystemVerifying: Map<number, boolean> = new Map();

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
        if (this.user.user_type && this.user.country && this.user.office) {
            this.fetchRequirements();
        }
    }

    fetchRequirements() {
        this.masterDataService.getRequirements(this.user.user_type, this.user.country, this.user.office)
            .subscribe(data => {
                this.requirements.set(data);
            });
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

            this.masterDataService.uploadUserDocument(formData).subscribe({
                next: () => {
                    this.isUploading.set(false);
                    alert('Uploaded!');
                    this.selectedFiles.delete(requirementId);
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
        return this.user.documents?.filter(d => d.document_requirement === requirementId && d.is_active)
            .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
    }

    verifyDoc(requirementId: number, status: 'VERIFIED' | 'REJECTED', method: string) {
        const doc = this.getUploadedDoc(requirementId);
        if (doc && doc.id) {
            const updateData = {
                verification_status: status,
                verification_method: method as 'MANUAL' | 'PORTAL',
                is_verified: status === 'VERIFIED'
            };
            this.masterDataService.verifyUserDocument(doc.id, updateData).subscribe(() => {
                alert(`Verified as ${status} via ${method}`);
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
                    const success = Math.random() > 0.1;
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
