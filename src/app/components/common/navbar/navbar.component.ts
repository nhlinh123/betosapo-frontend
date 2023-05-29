import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DataStoreService } from '../../../../services/data-store.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    isLogin$ = this.authService.authentication$;
    menuAppear = false;
    constructor(
        private router: Router,
        private authService: AuthService,
        private dataStore: DataStoreService
    ) {}

    ngOnInit(): void {}

    logout() {
        this.authService.logout().subscribe((rs) => {
            if (rs) {
                this.router.navigateByUrl('/');
                this.onResetData();
            }
        });
    }

    onResetData() {
        this.dataStore.resetData();
        this.menuAppear = false;
    }

    menu() {
        this.menuAppear = !this.menuAppear;
    }
}
