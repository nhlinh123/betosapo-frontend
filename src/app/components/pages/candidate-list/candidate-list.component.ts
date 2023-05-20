import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../../../services/job.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { loading, unloading } from '../../../../constants/function.constant';
import { AuthService } from '../../../../services/auth.service';
import { BaseResponse } from '../../../../models/base-response.model';

@Component({
    selector: 'app-candidate-list',
    templateUrl: './candidate-list.component.html',
    styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
    subscribe: Subject<any> = new Subject<any>();
    jobs: any[] = [];
    applieds: any[] = [];
    jobId: number = 0;
    jobType: string = '';
    categoryId: number = 0;
    categories: string[] = [];
    constructor(
        private router: Router,
        private jobService: JobService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authService.checkToken();
        this.initData();
    }

    initData(): void {
        loading();
        this.initJob();
        this.initCategories();
        this.getApplied(this.jobId, this.jobType, this.categoryId);
    }

    initJob() {
        this.jobService
            .getAllJobs()
            .pipe(
                tap((rs: BaseResponse<any[]>) => {
                    if (rs) {
                        this.jobs = rs.data;
                    }
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    initCategories() {
        this.categories = JSON.parse(sessionStorage.getItem('categories'));
    }

    getApplied(jobId?, jobType?, categoryId?) {
        this.jobService
            .getAllApplied(jobId, jobType, categoryId)
            .pipe(
                tap((rs: BaseResponse<any[]>) => {
                    if (rs) {
                        this.applieds = rs.data;
                    }
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    onChange($event) {
        if ($event) {
            this.getApplied(
                this.jobId ?? 0,
                this.jobType ?? '',
                this.categoryId ?? 0
            );
        }
    }

    downloadCV(path) {
        window.open(path);
    }
}
