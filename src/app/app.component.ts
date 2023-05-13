import { Component, OnInit } from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationStart,
    Router,
} from '@angular/router';
import {
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AuthService } from '../services/auth.service';

declare let $: any;
import { JwtHelperService } from '@auth0/angular-jwt';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
    ],
})
export class AppComponent implements OnInit {
    location: any;
    routerSubscription: any;

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {
        this.recallJsFuntions();
        const token = sessionStorage.getItem('token');
        if (token) {
            const helper = new JwtHelperService();
            const isExpired = helper.isTokenExpired(token);
            if (!isExpired) {
                this.authService.authentication$.next(true);
            } else {
                this.router.navigateByUrl('/login');
            }
        }
    }

    recallJsFuntions() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                $('.loader').fadeIn('slow');
            }
        });
        this.routerSubscription = this.router.events
            .pipe(
                filter(
                    (event) =>
                        event instanceof NavigationEnd ||
                        event instanceof NavigationCancel
                )
            )
            .subscribe((event) => {
                $.getScript('../assets/js/custom.js');
                $('.loader').fadeOut('slow');
                this.location = this.router.url;
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
            });
    }
}
