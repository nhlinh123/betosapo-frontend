import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobService } from '../../../../services/job.service';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-post-a-job',
    templateUrl: './post-a-job.component.html',
    styleUrls: ['./post-a-job.component.scss'],
})
export class PostAJobComponent implements OnInit, OnDestroy {
    form: FormGroup;
    subscribe: Subject<any> = new Subject<any>();
    categories: any[];
    partTime: any;
    fullTime: any;
    myFiles: any[] = [];
    loading = false;

    constructor(
        private categoryService: CategoryService,
        private jobService: JobService,
        private notifier: NotifierService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.initData();
    }

    ngOnDestroy() {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl(null),
            description: new FormControl(null),
            companyName: new FormControl(null),
            location: new FormControl(null),
            salary: new FormControl(null),
            number: new FormControl(null),
            position: new FormControl(null),
            categoryId: new FormControl(null),
        });
    }

    initData() {
        this.categories = JSON.parse(sessionStorage.getItem('categories'));
    }

    onFileChange(files) {
        if (this.myFiles.length === 10) return;
        for (const file of files) {
            this.myFiles.push(file);
        }
    }

    onDeleteFile(index: number) {
        this.myFiles.splice(index, 1);
    }

    getUserId() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user.id;
    }

    createJob() {
        this.loading = true;
        const data = this.form.getRawValue();
        const body = new FormData();
        for (const key of Object.keys(data)) {
            body.append(key, data[key]);
        }
        body.append('status', 'OPEN');
        body.append('userId', this.getUserId());
        body.append('jobType', this.partTime ?? this.fullTime);
        for (const file of this.myFiles) {
            body.append('files', file);
        }
        this.jobService
            .createJob(body)
            .pipe(takeUntil(this.subscribe))
            .subscribe(
                (res) => {
                    if (res) {
                        this.notifier.notify(
                            'success',
                            '新しい成功した仕事を作成する'
                        );
                        this.form.reset();
                    }
                },
                (error) => {
                    this.notifier.notify(
                        'success',
                        'エラーが発生しました。後でもう一度お試しください。'
                    );
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
    }

    onTypeChange(type) {
        switch (type) {
            case 'full':
                this.partTime = null;
                break;
            case 'part':
                this.fullTime = null;
                break;
        }
    }
}
