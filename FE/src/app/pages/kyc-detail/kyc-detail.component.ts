import { Component, inject, OnInit, signal, computed } from '@angular/core';
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

    // Data lists
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

    ngOnInit() {
        // Load Master Data
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
            alert('Please fill all mandatory fields (Name, Classification, Country, Office).');
            return;
        }

        this.masterDataService.saveUserDetail(this.user).subscribe({
            next: (data) => {
                alert('Profile saved successfully!');
                if (!this.isEditMode) {
                    this.router.navigate(['/kyc', data.id]);
                } else {
                    this.user = data;
                }
            },
            error: (err) => {
                console.error(err);
                alert('Error saving profile. Check console.');
            }
        });
    }

    handleFileInput(event: any, requirementId: number) {
        const file = event.target.files[0];
        if (file && this.user.id) {
            const formData = new FormData();
            formData.append('user_detail', this.user.id.toString());
            formData.append('document_requirement', requirementId.toString());
            formData.append('file_upload', file);

            this.masterDataService.uploadUserDocument(formData).subscribe(() => {
                alert('Document uploaded!');
                this.refreshUserData();
            });
        } else if (!this.user.id) {
            alert('Please save the profile first before uploading documents.');
        }
    }

    getUploadedDoc(requirementId: number): UserDocument | undefined {
        return this.user.documents?.find(d => d.document_requirement === requirementId && d.is_active);
    }

    isDocUploaded(requirementId: number): boolean {
        return !!this.getUploadedDoc(requirementId);
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
                alert(`Document ${status.toLowerCase()} via ${method.toLowerCase()}!`);
                this.refreshUserData();
            });
        }
    }
}
