import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IJob } from '../../../../models/job.model';

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
    job: IJob;
    constructor(private router: Router) {}

    ngOnInit() {
        const job = history.state.job;
        if (!job) {
            this.router.navigateByUrl('/job-list');
        }
        this.job = job;
        console.log(this.job);
    }
}
