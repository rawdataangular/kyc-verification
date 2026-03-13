import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CountryMaster, OfficeMaster, UserTypeMaster, DocumentTypeMaster, DocumentRequirement } from '../models/customer.model';

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

    private docTypesSubject = new BehaviorSubject<DocumentTypeMaster[]>([]);
    docTypes$ = this.docTypesSubject.asObservable();

    private matrixSubject = new BehaviorSubject<DocumentRequirement[]>([]);
    matrix$ = this.matrixSubject.asObservable();

    constructor() {
        this.refreshCountries();
        this.refreshOffices();
        this.refreshUserTypes();
        this.refreshDocTypes();
        this.refreshMatrix();
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

    // --- Document Types ---
    refreshDocTypes(): void {
        this.http.get<DocumentTypeMaster[]>(`${this.baseUrl}/document-types/`).subscribe(data => {
            this.docTypesSubject.next(data);
        });
    }

    addDocType(docType: DocumentTypeMaster): Observable<DocumentTypeMaster> {
        return this.http.post<DocumentTypeMaster>(`${this.baseUrl}/document-types/`, docType).pipe(
            tap(() => this.refreshDocTypes())
        );
    }

    updateDocType(docType: DocumentTypeMaster): Observable<DocumentTypeMaster> {
        return this.http.put<DocumentTypeMaster>(`${this.baseUrl}/document-types/${docType.id}/`, docType).pipe(
            tap(() => this.refreshDocTypes())
        );
    }

    deleteDocType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/document-types/${id}/`).pipe(
            tap(() => this.refreshDocTypes())
        );
    }

    // --- Mapping Matrix ---
    refreshMatrix(): void {
        this.http.get<DocumentRequirement[]>(`${this.baseUrl}/requirement-matrix/`).subscribe(data => {
            this.matrixSubject.next(data);
        });
    }

    getRequirements(userTypeId: number, countryId: number, officeId: number): Observable<DocumentRequirement[]> {
        return this.http.get<DocumentRequirement[]>(`${this.baseUrl}/requirement-matrix/?user_type=${userTypeId}&country=${countryId}&office=${officeId}`);
    }

    addMapping(mapping: DocumentRequirement): Observable<DocumentRequirement> {
        return this.http.post<DocumentRequirement>(`${this.baseUrl}/requirement-matrix/`, mapping).pipe(
            tap(() => this.refreshMatrix())
        );
    }

    updateMapping(mapping: DocumentRequirement): Observable<DocumentRequirement> {
        return this.http.put<DocumentRequirement>(`${this.baseUrl}/requirement-matrix/${mapping.id}/`, mapping).pipe(
            tap(() => this.refreshMatrix())
        );
    }

    deleteMapping(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/requirement-matrix/${id}/`).pipe(
            tap(() => this.refreshMatrix())
        );
    }

    // --- User Details & KYC ---
    saveUserDetail(userDetail: any): Observable<any> {
        if (userDetail.id) {
            return this.http.put(`${this.baseUrl}/user-details/${userDetail.id}/`, userDetail);
        }
        return this.http.post(`${this.baseUrl}/user-details/`, userDetail);
    }

    getUserDetailById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/user-details/${id}/`);
    }

    uploadUserDocument(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/user-documents/`, formData);
    }
}
