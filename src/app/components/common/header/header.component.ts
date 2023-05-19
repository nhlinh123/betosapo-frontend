import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { loading, unloading } from '../../../../constants/function.constant';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JobService } from '../../../../services/job.service';
import { CategoryService } from '../../../../services/category.service';
import { DataStoreService } from '../../../../services/data-store.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    searchText: string = '';
    category: number;
    subscribe: Subject<any> = new Subject<any>();
    JOB_LIST = '/job-list';
    isJobList: boolean = false;

    @Input() categories: any[];
    @Output() triggerSearch: Subject<any> = new Subject<any>();

    constructor(
        private jobService: JobService,
        private categoryService: CategoryService,
        private dataStore: DataStoreService,
        private router: Router
    ) {}
    ngOnInit() {
        this.getAllCategories();
        if (this.dataStore.searchText && this.dataStore.searchText !== '')
            this.searchText = this.dataStore.searchText;
        if (this.dataStore.categoryId && this.dataStore.categoryId !== 0)
            this.category = this.dataStore.categoryId;
        this.isJobList = this.router.url === this.JOB_LIST;
        console.log(this.isJobList);
    }
    ngOnDestroy(): void {
        this.subscribe.complete();
        this.subscribe.unsubscribe();
    }
    getAllCategories() {
        const categories = JSON.parse(sessionStorage.getItem('categories'));
        if (categories) {
            this.categories = categories;
            return;
        }
        this.categoryService
            .getAll()
            .pipe(
                tap((res) => {
                    const cate = res?.data.map((rs) => {
                        return {
                            Id: rs.Id,
                            Name: rs.Name,
                        };
                    });
                    sessionStorage.setItem('categories', JSON.stringify(cate));
                    this.categories = cate;
                }),
                takeUntil(this.subscribe)
            )
            .subscribe();
    }

    search() {
        this.triggerSearch.next({
            title: this.searchText,
            categoryId: this.category,
        });
    }
}
