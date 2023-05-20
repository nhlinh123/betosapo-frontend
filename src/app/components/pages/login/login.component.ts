import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { unloading } from '../../../../constants/function.constant';

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
        unloading();
    }

    login() {
        const { email, password } = this.form.getRawValue();
        this.authService.login(email, password).subscribe(
            (res) => {
                if (res) {
                    this.router.navigateByUrl('/');
                    this.notifier.notify('success', '正常にログインしました!');
                }
            },
            (err) => {
                if (err?.error?.message.includes('was not found')) {
                    this.notifier.notify(
                        'error',
                        'メールアドレスが存在しません。もう一度お試しください。'
                    );
                } else if (
                    err?.error?.message.includes('Incorrect password') ||
                    err?.error?.message.includes('must be a valid email')
                ) {
                    this.notifier.notify(
                        'error',
                        'メールアドレスまたはパスワードが間違っています。もう一度お試しください'
                    );
                } else {
                    this.notifier.notify(
                        'error',
                        'エラーが発生しました。もう一度やり直してください！'
                    );
                }
            }
        );
    }

    isFormInValid(controlName: string) {
        return (
            this.form.get(controlName).touched &&
            this.form.get(controlName).invalid
        );
    }
}
