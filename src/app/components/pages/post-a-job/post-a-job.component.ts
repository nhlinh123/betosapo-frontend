import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-post-a-job',
    templateUrl: './post-a-job.component.html',
    styleUrls: ['./post-a-job.component.scss'],
})
export class PostAJobComponent implements OnInit, OnDestroy {
    form: FormGroup;
    subscribe: Subject<any> = new Subject<any>();
    categories: any[];
    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        this.initForm();
        this.initData();
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
        this.subscribe.complete();
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
            jobType: new FormControl(null),
            status: new FormControl(null),
            categoryId: new FormControl(null),
            picturePath: new FormControl(null),
        });
    }

    initData() {
        this.categoryService
            .getAll()
            .pipe(takeUntil(this.subscribe))
            .subscribe((res) => {
                this.categories = res?.data.map((rs) => {
                    return {
                        Id: rs.Id,
                        Name: rs.Name,
                    };
                });
                console.log(this.categories);
            });
    }
}
