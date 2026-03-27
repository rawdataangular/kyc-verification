import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurepassService {
  private http = inject(HttpClient);

  // Base URL for Surepass API
  private baseUrl = 'https://sandbox.surepass.io/api/v1';

  // TODO: Replace 'TOKEN' with the exact Bearer Token provided by Surepass
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3MzY2NzUxOSwianRpIjoiYjhhNDQ4ZWQtYjk5Zi00Y2VkLThiZDctOTY5Njk5YTk5OGIwIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmJpbnVzaF8xNTM5OTBAc3VyZXBhc3MuaW8iLCJuYmYiOjE3NzM2Njc1MTksImV4cCI6MTc3NjI1OTUxOSwiZW1haWwiOiJiaW51c2hfMTUzOTkwQHN1cmVwYXNzLmlvIiwidGVuYW50X2lkIjoibWFpbiIsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ1c2VyIl19fQ.fXjnBiuJxpLDV2QOAdZfQfoQnnqAu_y45aazdE3x8oQ';

  /**
   * Calls the Surepass verification API by mapping Document Types to corresponding endpoints
   * @param documentType Name / Type of the document.
   * @param idNumber Identifying primary key / number inside the document.
   */
  verifyDocument(documentType: string, idNumber: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      id_number: idNumber
    };

    // Determine the specific api path according to the document type given
    let endpointPath = '';
    const dt = documentType.toLowerCase().trim();

    // The user requested specifically these three endpoints to be appended
    if (dt.includes('pan') || dt.includes('PAN')) {
      endpointPath = '/pan/pan-comprehensive';
    } else if (dt.includes('gst') || dt.includes('corporate') || dt.includes('GST Number')) {
      // Appending /corporate-gstin stripped of 'api/' to avoid duplicate base url paths
      endpointPath = '/corporate-gstin';
    } else if (dt.includes('iec') || dt.includes('import') || dt.includes('export') || dt.includes('Import Export Code')) {
      // Appending /iec stripped of 'api/'
      endpointPath = '/iec';
    } else {
      // Fallback for unsupported documents since only 3 are requested
      return throwError(() => new Error(`Document type '${documentType}' is not supported. Only PAN, Corporate GSTIN, and IEC are permitted.`));
    }

    const url = `${this.baseUrl}${endpointPath}`;

    return this.http.post<any>(url, body, { headers });
  }
}
