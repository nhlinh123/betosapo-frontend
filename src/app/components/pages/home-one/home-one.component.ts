import { Component, isStandalone, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { CategoryService } from '../../../../services/category.service';
import { Subject } from 'rxjs';
import { JobService } from '../../../../services/job.service';
import { IJob, JobsByTypeRequest } from '../../../../models/job.model';
import { loading, unloading } from '../../../../constants/function.constant';
import { DataStoreService } from '../../../../services/data-store.service';

@Component({
    selector: 'app-home-one',
    templateUrl: './home-one.component.html',
    styleUrls: ['./home-one.component.scss'],
})
export class HomeOneComponent implements OnInit, OnDestroy {
    subscribe: Subject<any> = new Subject<any>();
    jobs: any[] = [];
    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private jobService: JobService,
        private dataStore: DataStoreService
    ) {}

    ngOnInit(): void {
        this.initData();
    }

    ngOnDestroy(): void {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }

    initData() {
        this.get8NewestJobs();
    }

    get8NewestJobs() {
        loading();
        this.jobService
            .getNewestJobs()
            .pipe(
                tap((res) => {
                    if (res) {
                        this.jobs = res?.data;
                    }
                }),
                takeUntil(this.subscribe),
                finalize(() => unloading())
            )
            .subscribe();
    }

    getJobsByType(type: string) {
        loading();
        const body = { type, limit: 8, offset: 0 } as JobsByTypeRequest;
        this.jobService
            .getJobsByType(body)
            .pipe(
                tap((rs) => {
                    if (rs) {
                        this.jobs = rs?.data;
                    }
                }),
                takeUntil(this.subscribe),
                finalize(() => unloading())
            )
            .subscribe();
    }

    onGetData(type: string) {
        switch (type) {
            case '8newest':
                this.get8NewestJobs();
                break;
            default:
                this.getJobsByType(type);
                break;
        }
    }

    search($event) {
        const { title, categoryId } = $event;
        this.dataStore.searchText = title;
        this.dataStore.categoryId = categoryId;
        this.router.navigateByUrl('/job-list');
    }

    goToJobDetail(job: IJob) {
        const navigationExtras: NavigationExtras = {
            state: {
                job: job,
            },
        };
        this.router.navigate([`/job-detail/${job.Id}`], navigationExtras);
    }
}
