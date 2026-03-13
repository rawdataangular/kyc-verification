import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { UserDetail } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8000/api';

    private customersSubject = new BehaviorSubject<UserDetail[]>([]);
    customers$ = this.customersSubject.asObservable();

    constructor() {
        this.refreshCustomers();
    }

    refreshCustomers(): void {
        this.http.get<UserDetail[]>(`${this.baseUrl}/user-details/`).subscribe(data => {
            this.customersSubject.next(data);
        });
    }

    getCustomers(): Observable<UserDetail[]> {
        return this.customers$;
    }

    getCustomerById(id: string): Observable<UserDetail | undefined> {
        return this.http.get<UserDetail>(`${this.baseUrl}/user-details/${id}/`);
    }

    verifyDocument(customerId: string, documentId: string): Observable<any> {
        // This will be handled by the document fulfillment logic in the detail view
        return this.http.post(`${this.baseUrl}/user-documents/verify/`, { customerId, documentId });
    }
}
