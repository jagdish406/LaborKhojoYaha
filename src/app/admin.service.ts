import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Interface for the dropdown options
  getOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/options`);
  }

  // Submit the form data
  submitRecord(record: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/record`, record);
  }

  // Get the list of all records
  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/records`);
  }
}