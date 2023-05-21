import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { JobService } from '../../../../services/job.service';
import { NotifierService } from 'angular-notifier';
import { loading, unloading } from '../../../../constants/function.constant';

type FileType = 'logo' | 'pictures';

@Component({
    selector: 'app-post-a-job',
    templateUrl: './post-a-job.component.html',
    styleUrls: ['./post-a-job.component.scss'],
})
export class PostAJobComponent implements OnInit, OnDestroy {
    form: FormGroup;
    subscribe: Subject<any> = new Subject<any>();
    categories: any[];
    /* variables to manipulate job type */
    partTime: any;
    fullTime: any;
    /* variables to manipulate files */
    myFiles: any[] = [];
    logoFile: any[] = [];
    loading = false;

    @ViewChild('fileElement', { static: true }) fileElement: ElementRef;
    @ViewChild('filesElement', { static: true }) filesElement: ElementRef;
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
            title: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            companyName: new FormControl(null, [Validators.required]),
            location: new FormControl(null, [Validators.required]),
            salary: new FormControl(null, [Validators.required]),
            number: new FormControl(null, [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
            ]),
            position: new FormControl(null, [Validators.required]),
            categoryId: new FormControl(null, [Validators.required]),
        });
    }

    initData() {
        this.categories = JSON.parse(sessionStorage.getItem('categories'));
        unloading();
    }

    onFileChange(event, type: FileType) {
        console.log(event);
        if (type === 'pictures') {
            if (this.myFiles.length === 10) return;
            for (const file of event.target.files) {
                if (file) {
                    console.log(file);
                    if (file.type?.includes('image/')) {
                        this.myFiles.push(file);
                    } else {
                        this.notifier.notify(
                            'error',
                            '画像の長さ：幅の比率は 1:1 である必要があります。'
                        );
                    }
                }
            }
        } else {
            const file = event.target.files[0];
            console.log(file);
            if (file) {
                console.log(file);

                if (!file.type?.includes('image/')) {
                    this.notifier.notify(
                        'error',
                        '.jpg、jpeg、.png 形式のファイルを選択してください。'
                    );
                    return;
                }

                console.log(file);
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const image = new Image();
                    image.src = e.target.result;

                    image.onload = () => {
                        const aspectRatio = image.width / image.height;
                        const ratio = Math.round(aspectRatio * 10) / 10;
                        console.log('Aspect Ratio:', ratio);
                        if (ratio !== 1) {
                            this.notifier.notify(
                                'error',
                                '画像の長さ：幅の比率は 1:1 である必要があります。'
                            );
                        } else {
                            this.logoFile = [file];
                        }
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    }

    onDeleteFile(index: number, type: FileType) {
        if (type === 'pictures') this.myFiles.splice(index, 1);
        if (type === 'logo') this.logoFile.splice(index, 1);
        console.log(this.logoFile);
        console.log(this.myFiles);
    }

    getUserId() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user.id;
    }

    createJob() {
        this.loading = true;
        const timestamp = new Date().getTime();
        const data = this.form.getRawValue();
        const body = new FormData();
        for (const key of Object.keys(data)) {
            body.append(key, data[key]);
        }
        body.append('status', 'OPEN');
        body.append('userId', this.getUserId());
        body.append('jobType', this.partTime ?? this.fullTime);
        let index = 0;
        for (const file of this.logoFile) {
            const fileName = `${timestamp}_${index}_${file.name}`;
            body.append('files', file, fileName);
            index++;
        }
        index = 0;
        for (const file of this.myFiles) {
            const fileName = `${timestamp}_${index}_${file.name}`;
            body.append('files', file, fileName);
            index++;
        }
        loading();
        this.jobService
            .createJob(body)
            .pipe(
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe(
                (res) => {
                    if (res) {
                        this.notifier.notify(
                            'success',
                            '新しい成功した仕事を作成する'
                        );
                        this.resetForm();
                    }
                },
                (error) => {
                    if (error) {
                        if (
                            error.error.message === 'File too large' ||
                            error.message === 'File too large'
                        ) {
                            this.notifier.notify(
                                'error',
                                'ファイルは 5MB を超えることはできません。もう一度お試しください。'
                            );
                        } else {
                            this.notifier.notify(
                                'error',
                                'エラーが発生しました。後でもう一度お試しください。'
                            );
                        }
                        this.loading = false;
                    }
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

    openBrowser(type: FileType) {
        if (type === 'logo') this.fileElement.nativeElement.click();
        if (type === 'pictures') this.filesElement.nativeElement.click();
    } //

    private resetForm() {
        this.form.reset();
        this.myFiles = [];
        this.logoFile = [];
    }
}
