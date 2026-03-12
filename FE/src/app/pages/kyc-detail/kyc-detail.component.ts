import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';

interface DocItem {
    id: string;
    name: string;
    type: string;
    status: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
    isVerifying?: boolean;
}

@Component({
    selector: 'app-kyc-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
    templateUrl: './kyc-detail.component.html'
})
export class KycDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private customerService = inject(CustomerService);

    isEditMode = false;
    customer: Partial<Customer> = {
        name: '',
        email: '',
        phone: '',
        country: 'USA'
    };

    documents: DocItem[] = [
        { id: '1', name: 'Aadhaar Card / ID', type: 'Primary', status: 'Pending' },
        { id: '2', name: 'GST Certificate', type: 'Business', status: 'Pending' },
        { id: '3', name: 'Utility Bill', type: 'Address', status: 'Verified' },
        { id: '4', name: 'PAN Card', type: 'Tax', status: 'Pending' }
    ];

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.customerService.getCustomerById(id).subscribe(c => {
                if (c) this.customer = { ...c };
            });
        }
    }

    getDocStatusClassName(status: string) {
        switch (status) {
            case 'Verified': return 'badge-verified';
            case 'Pending': return 'badge-pending';
            case 'Rejected': return 'badge-rejected';
            case 'Expired': return 'badge-expired';
            default: return 'bg-secondary text-white';
        }
    }

    verifyDoc(doc: DocItem) {
        doc.isVerifying = true;
        this.customerService.verifyDocument('mock', doc.id).subscribe(() => {
            doc.status = 'Verified';
            doc.isVerifying = false;
        });
    }
}
