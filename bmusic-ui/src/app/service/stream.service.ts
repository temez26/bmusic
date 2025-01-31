import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  Stream(filename: string, range: string): Observable<Blob> {
    console.log(`${this.baseUrl}music/${filename}`);
    const headers = new HttpHeaders().set('Range', range);
    return this.http.get(`${this.baseUrl}music/${filename}`, {
      headers,
      responseType: 'blob',
    });
  }
}
