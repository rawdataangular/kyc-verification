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
            case 'Verified':
                return 'badge-verified';
            case 'Approval Pending':
                return 'badge-approval';
            case 'KYC Pending':
                return 'badge-pending';
            case 'KYC Expired':
                return 'badge-expired';
            case 'KYC Rejected':
                return 'badge-rejected';
            default:
                return 'bg-secondary text-white';
        }
    }
}
