import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        const job = history.state.job;
        console.log(job);
    }
}
