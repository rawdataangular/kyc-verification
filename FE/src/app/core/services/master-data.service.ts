import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CountryMaster, OfficeMaster, UserTypeMaster } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class MasterDataService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8000/api';

    private countriesSubject = new BehaviorSubject<CountryMaster[]>([]);
    countries$ = this.countriesSubject.asObservable();

    private officesSubject = new BehaviorSubject<OfficeMaster[]>([]);
    offices$ = this.officesSubject.asObservable();

    private userTypesSubject = new BehaviorSubject<UserTypeMaster[]>([]);
    userTypes$ = this.userTypesSubject.asObservable();

    constructor() {
        this.refreshCountries();
        this.refreshOffices();
        this.refreshUserTypes();
    }

    // --- Countries ---
    refreshCountries(): void {
        this.http.get<CountryMaster[]>(`${this.baseUrl}/countries/`).subscribe(data => {
            this.countriesSubject.next(data);
        });
    }

    addCountry(country: CountryMaster): Observable<CountryMaster> {
        return this.http.post<CountryMaster>(`${this.baseUrl}/countries/`, country).pipe(
            tap(() => this.refreshCountries())
        );
    }

    updateCountry(country: CountryMaster): Observable<CountryMaster> {
        return this.http.put<CountryMaster>(`${this.baseUrl}/countries/${country.id}/`, country).pipe(
            tap(() => this.refreshCountries())
        );
    }

    deleteCountry(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/countries/${id}/`).pipe(
            tap(() => this.refreshCountries())
        );
    }

    // --- Offices ---
    refreshOffices(): void {
        this.http.get<OfficeMaster[]>(`${this.baseUrl}/offices/`).subscribe(data => {
            this.officesSubject.next(data);
        });
    }

    addOffice(office: OfficeMaster): Observable<OfficeMaster> {
        return this.http.post<OfficeMaster>(`${this.baseUrl}/offices/`, office).pipe(
            tap(() => this.refreshOffices())
        );
    }

    updateOffice(office: OfficeMaster): Observable<OfficeMaster> {
        return this.http.put<OfficeMaster>(`${this.baseUrl}/offices/${office.id}/`, office).pipe(
            tap(() => this.refreshOffices())
        );
    }

    deleteOffice(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/offices/${id}/`).pipe(
            tap(() => this.refreshOffices())
        );
    }

    // --- User Types ---
    refreshUserTypes(): void {
        this.http.get<UserTypeMaster[]>(`${this.baseUrl}/user-types/`).subscribe(data => {
            this.userTypesSubject.next(data);
        });
    }

    addUserType(userType: UserTypeMaster): Observable<UserTypeMaster> {
        return this.http.post<UserTypeMaster>(`${this.baseUrl}/user-types/`, userType).pipe(
            tap(() => this.refreshUserTypes())
        );
    }

    updateUserType(userType: UserTypeMaster): Observable<UserTypeMaster> {
        return this.http.put<UserTypeMaster>(`${this.baseUrl}/user-types/${userType.id}/`, userType).pipe(
            tap(() => this.refreshUserTypes())
        );
    }

    deleteUserType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/user-types/${id}/`).pipe(
            tap(() => this.refreshUserTypes())
        );
    }
}
