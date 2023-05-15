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
    jobId: number;
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
        this.getApplied(0);
    }

    initJob() {
        this.jobService
            .getAllJobs()
            .pipe(
                tap((rs: BaseResponse<any[]>) => {
                    if (rs.code === 200) {
                        this.jobs = rs.data;
                    }
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    getApplied(jobId?) {
        this.jobService
            .getAllApplied(jobId)
            .pipe(
                tap((rs: BaseResponse<any[]>) => {
                    if (rs.code === 200) {
                        this.applieds = rs.data;
                        console.log(this.applieds);
                    }
                }),
                finalize(() => unloading()),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    onChange($event) {
        if ($event) {
            this.getApplied(this.jobId);
        }
    }

    downloadCV(path) {
        window.open(path);
    }
}
