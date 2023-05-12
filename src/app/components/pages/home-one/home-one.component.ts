import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-one',
    templateUrl: './home-one.component.html',
    styleUrls: ['./home-one.component.scss'],
})
export class HomeOneComponent implements OnInit {
    categories: any[];
    constructor(private router: Router) {}

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.categories = JSON.parse(sessionStorage.getItem('categories'));
    }

    viewMore() {
        this.router.navigateByUrl('/job-list');
    }
}
