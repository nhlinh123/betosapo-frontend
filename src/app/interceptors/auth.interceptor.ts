import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private ignoredUrls = ['/api/auth/signin'];

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('token');
        if (token && !this.isIgnoredUrl(request.url)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return next.handle(request);
    }

    private isIgnoredUrl(url: string): boolean {
        return this.ignoredUrls.some((ignoredUrl) => url.includes(ignoredUrl));
    }
}
