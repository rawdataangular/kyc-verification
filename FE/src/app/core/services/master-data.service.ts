import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CountryMaster } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class MasterDataService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8000/api/countries/';

    private countriesSubject = new BehaviorSubject<CountryMaster[]>([]);
    countries$ = this.countriesSubject.asObservable();

    constructor() {
        this.refreshCountries();
    }

    refreshCountries(): void {
        this.http.get<CountryMaster[]>(this.apiUrl).subscribe(data => {
            this.countriesSubject.next(data);
        });
    }

    getCountries(): Observable<CountryMaster[]> {
        return this.http.get<CountryMaster[]>(this.apiUrl);
    }

    addCountry(country: CountryMaster): Observable<CountryMaster> {
        return this.http.post<CountryMaster>(this.apiUrl, country).pipe(
            tap(() => this.refreshCountries())
        );
    }

    updateCountry(country: CountryMaster): Observable<CountryMaster> {
        return this.http.put<CountryMaster>(`${this.apiUrl}${country.id}/`, country).pipe(
            tap(() => this.refreshCountries())
        );
    }

    deleteCountry(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
            tap(() => this.refreshCountries())
        );
    }
}
