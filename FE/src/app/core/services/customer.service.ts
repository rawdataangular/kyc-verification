import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, of } from 'rxjs';
import { Customer, Document } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private customers = new BehaviorSubject<Customer[]>([
        {
            id: '1',
            name: 'John Doe',
            country: 'USA',
            phone: '+1 234 567 890',
            email: 'john.doe@example.com',
            status: 'KYC Pending',
            kycSummary: { required: 5, accepted: 2, rejected: 1, expired: 0 }
        },
        {
            id: '2',
            name: 'Jane Smith',
            country: 'UK',
            phone: '+44 7700 900123',
            email: 'jane.smith@example.co.uk',
            status: 'Approval Pending',
            kycSummary: { required: 4, accepted: 4, rejected: 0, expired: 0 }
        },
        {
            id: '3',
            name: 'Rajesh Kumar',
            country: 'India',
            phone: '+91 98765 43210',
            email: 'rajesh.kumar@techcorp.in',
            status: 'KYC Expired',
            kycSummary: { required: 6, accepted: 3, rejected: 0, expired: 3 }
        }
    ]);

    customers$ = this.customers.asObservable();

    getCustomers() {
        return this.customers$;
    }

    getCustomerById(id: string) {
        return this.customers$.pipe(
            map(customers => customers.find(c => c.id === id))
        );
    }

    verifyDocument(customerId: string, documentId: string) {
        // Mock 2-second loading and update
        return of(true).pipe(delay(2000));
    }
}
