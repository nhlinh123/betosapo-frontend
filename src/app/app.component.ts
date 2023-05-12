import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    Router,
    NavigationStart,
    NavigationCancel,
    NavigationEnd,
} from '@angular/router';
import {
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { Subject } from 'rxjs';
declare let $: any;

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
export class AppComponent implements OnInit, OnDestroy {
    location: any;
    routerSubscription: any;
    subscribe: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private authService: AuthService,
        private categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.recallJsFuntions();
        const token = sessionStorage.getItem('token');
        if (token) {
            //TODO: tạm thời chưa có refesh token exprie date nên workarond tạm ở đây??
            this.authService.authentication$.next(true);
        }
        this.initData();
    }

    ngOnDestroy() {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
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

    initData() {
        this.categoryService
            .getAll()
            .pipe(takeUntil(this.subscribe))
            .subscribe((res) => {
                const categories = res?.data.map((rs) => {
                    return {
                        Id: rs.Id,
                        Name: rs.Name,
                    };
                });
                sessionStorage.setItem(
                    'categories',
                    JSON.stringify(categories)
                );
            });
    }
}
