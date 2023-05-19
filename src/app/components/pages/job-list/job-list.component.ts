import { Component, OnDestroy, OnInit } from '@angular/core';
import { JobService } from '../../../../services/job.service';
import { IJob, SearchJobRequest } from '../../../../models/job.model';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { BaseResponse } from '../../../../models/base-response.model';
import { DataStoreService } from '../../../../services/data-store.service';
import { loading, unloading } from '../../../../constants/function.constant';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    selector: 'app-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy {
    subscribe: Subject<any> = new Subject<any>();
    jobs: IJob[] = [];
    total: number = 0;
    left: number = 0;
    page: number = 0;
    limit: number = 8;
    constructor(
        private jobService: JobService,
        private dataStore: DataStoreService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initData();
    }

    ngOnDestroy(): void {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }

    initData() {
        const body = this.getBody(
            this.dataStore.searchText.trim() ?? '',
            this.dataStore.categoryId ?? 0,
            this.limit,
            0
        );
        this.executeService(body);
    }

    getBody(title, categoryId, limit, offset): SearchJobRequest {
        return {
            title,
            categoryId,
            limit,
            offset,
        } as SearchJobRequest;
    }

    search($event) {
        if (!$event) return;
        const { title, categoryId } = $event;
        loading();
        const body = this.getBody(title, Number(categoryId), 8, 0);
        this.executeService(body);
    }

    executeService(body) {
        this.jobService
            .searchJobsByTypeAndTitle(body)
            .pipe(
                tap((rs: BaseResponse<IJob[]>) => {
                    this.jobs = rs.data;
                    this.total = rs.total;
                    this.left = rs.left;
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    viewMore() {
        if (this.left < 1) return;
        this.page += 1;
        const body = this.getBody(
            this.dataStore.searchText ?? '',
            this.dataStore.categoryId ?? 0,
            this.limit,
            this.page * this.limit
        );
        this.jobService
            .searchJobsByTypeAndTitle(body)
            .pipe(
                tap((rs: BaseResponse<IJob[]>) => {
                    this.jobs.push(...rs.data);
                    this.total = rs.total;
                    this.left = rs.left;
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
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
