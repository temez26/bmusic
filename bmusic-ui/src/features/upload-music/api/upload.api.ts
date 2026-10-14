import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@shared/api';

export interface UploadResult {
  uploaded: string[];
  failed: { file: string; error: string }[];
}

@Injectable({ providedIn: 'root' })
export class UploadApi {
  private readonly http = inject(HttpClient);

  upload(files: File[]): Observable<HttpEvent<UploadResult>> {
    const body = new FormData();
    files.forEach((file) => body.append('files', file));
    return this.http.post<UploadResult>(apiUrl('uploads'), body, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
