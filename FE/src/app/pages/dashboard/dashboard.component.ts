import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CustomerService } from '../../core/services/customer.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserDetail } from '../../core/models/customer.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    customerService = inject(CustomerService);
    themeService = inject(ThemeService);

    customers = signal<UserDetail[]>([]);

    constructor() {
        this.customerService.customers$.subscribe(data => {
            this.customers.set(data);
        });
    }

    getStatusClassName(status: string): string {
        switch (status) {
            case 'APPROVED':
            case 'Verified':
                return 'badge-verified';
            case 'PENDING_APPROVAL':
            case 'Approval Pending':
                return 'badge-approval';
            case 'KYC_PENDING':
            case 'KYC Pending':
                return 'badge-pending';
            case 'EXPIRED':
            case 'KYC Expired':
                return 'badge-expired';
            case 'REJECTED':
            case 'KYC Rejected':
                return 'badge-rejected';
            case 'DRAFT':
                return 'bg-light text-dark border';
            default:
                return 'bg-secondary text-white';
        }
    }
}
