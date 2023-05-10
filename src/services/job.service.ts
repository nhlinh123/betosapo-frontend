import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JobService {
    private apiUrl = environment.API_URL;
    private path = 'api/job';
    constructor(private http: HttpClient) {}

    createJob(body: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/${this.path}/create`, body);
    }
}
