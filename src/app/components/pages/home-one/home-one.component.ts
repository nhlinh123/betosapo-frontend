import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { CategoryService } from '../../../../services/category.service';
import { Subject } from 'rxjs';
import { JobService } from '../../../../services/job.service';
import { JobsByTypeRequest } from '../../../../models/job.model';
import { loading, unloading } from '../../../../constants/function.constant';

@Component({
    selector: 'app-home-one',
    templateUrl: './home-one.component.html',
    styleUrls: ['./home-one.component.scss'],
})
export class HomeOneComponent implements OnInit, OnDestroy {
    categories: any[];
    subscribe: Subject<any> = new Subject<any>();
    jobs: any[] = [];
    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private jobService: JobService
    ) {}

    ngOnInit(): void {
        this.initData();
    }

    ngOnDestroy(): void {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }
    viewMore() {
        this.router.navigateByUrl('/job-list');
    }

    initData() {
        this.getAllCategories();
        this.get8NewestJobs();
    }

    getAllCategories() {
        loading();
        this.categoryService
            .getAll()
            .pipe(
                tap((res) => {
                    const categories = res?.data.map((rs) => {
                        return {
                            Id: rs.Id,
                            Name: rs.Name,
                        };
                    });
                    sessionStorage.setItem(
                        'categories',
                        JSON.stringify(categories)
                    );
                    this.categories = categories;
                }),
                takeUntil(this.subscribe),
                finalize(() => unloading())
            )
            .subscribe();
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
}
