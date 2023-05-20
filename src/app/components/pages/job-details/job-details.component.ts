import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IJob } from '../../../../models/job.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../../../services/job.service';
import { Subject } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { loading, unloading } from '../../../../constants/function.constant';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit, OnDestroy {
    job: IJob;
    images = [];

    form: FormGroup;
    files: any[] = [];
    loading = false;
    subscribe: Subject<any> = new Subject<any>();
    @ViewChild('fileElement', { static: true }) fileElement: ElementRef;
    allowType = '.pdf, .docx, .png, .jpg, .jpeg';

    constructor(
        private router: Router,
        private jobService: JobService,
        private notifier: NotifierService
    ) {}

    ngOnInit() {
        this.initData();
        this.initForm();
    }

    ngOnDestroy(): void {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }

    browser() {
        this.fileElement.nativeElement.click();
    }

    uploadCV($event) {
        const file = $event.target.files[0];
        const allowArray = this.allowType.split(', ');
        if (file) {
            const fileType = file.name.split('.');
            if (!allowArray.includes('.' + fileType[1])) {
                this.notifier.notify(
                    'error',
                    '.pdf、.docx、.png、.jpg、.jpeg 内のファイルを選択します'
                );
                return;
            }
            this.files = [file];
        }
    }

    apply() {
        const data = this.form.getRawValue();
        const body = new FormData();
        for (const key of Object.keys(data)) {
            body.append(key, data[key]);
        }
        body.append('files', this.files[0]);
        body.append('jobId', this.job.Id.toString());

        this.loading = true;
        loading();
        this.jobService
            .apply(body)
            .pipe(
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe(
                (res) => {
                    if (res) {
                        this.loading = false;
                        this.form.reset();
                        this.files = [];
                        this.notifier.notify('success', '無事に適用されました');
                    }
                },
                (err) => {
                    if (err) {
                        this.notifier.notify(
                            'error',
                            'エラーが発生しました。後でもう一度お試しください。'
                        );
                    }
                }
            );
    }

    private initData() {
        const job = history.state.job;
        if (!job) {
            this.router.navigateByUrl('/job-list');
        }
        this.job = job;
        this.images = job?.PicturePath.map((path) => {
            return {
                path,
            };
        });
    }

    private initForm() {
        this.form = new FormGroup({
            fullName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
            ]),
            phoneNumber: new FormControl(null, [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
            ]),
        });
    }

    onDeleteFile(i: number) {
        this.files.splice(i, 1);
    }
}
