import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    constructor(
        private authService: AuthService,
        private router: Router,
        private notifier: NotifierService
    ) {}

    ngOnInit(): void {
        this.initFormGroup();
    }

    initFormGroup() {
        this.form = new FormGroup({
            email: new FormControl(
                null,
                Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
            ),
            password: new FormControl(null, [
                Validators.pattern('^[a-zA-Z0-9]{6,30}$'),
            ]),
        });
    }

    login() {
        const { email, password } = this.form.getRawValue();
        this.authService.login(email, password).subscribe((res) => {
            if (res) {
                this.router.navigateByUrl('/');
                this.notifier.notify('success', '正常にログインしました!');
            }
        });
    }

    isFormInValid(controlName: string) {
        return this.form.invalid && this.form.get(controlName).invalid;
    }
}
