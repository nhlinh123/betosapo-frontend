import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    isLogin$ = this.authService.authentication$;
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {}

    logout() {
        this.authService.logout().subscribe((rs) => {
            if (rs) {
                this.router.navigateByUrl('/');
            }
        });
    }
}
