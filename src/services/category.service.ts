import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private apiUrl = environment.API_URL;
    private path = 'api/category';
    constructor(private http: HttpClient) {}

    getAll(): Observable<BaseResponse<any>> {
        return this.http
            .get(`${this.apiUrl}/${this.path}/getAll`)
            .pipe(map((rs) => new BaseResponse<any>(rs)));
    }
}
