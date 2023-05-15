import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.API_URL;
    private path = 'api/auth';
    authentication$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    constructor(private http: HttpClient, private router: Router) {}

    login(email: string, password: string): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/${this.path}/signin`, {
                email,
                password,
            })
            .pipe(
                tap((res) => {
                    this.setUserToSessionStorage(res.data);
                    this.setToken(res?.data?.token);
                    this.authentication$.next(true);
                })
            );
    }

    logout() {
        this.authentication$.next(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        return of(true);
    }

    setUserToSessionStorage(user: any) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    setToken(token: string) {
        sessionStorage.setItem('token', token);
    }

    getUserInfo() {
        return sessionStorage.getItem('user');
    }

    checkToken() {
        const token = sessionStorage.getItem('token');
        if (!token) {
            this.router.navigateByUrl('/login');
        }
    }
}
