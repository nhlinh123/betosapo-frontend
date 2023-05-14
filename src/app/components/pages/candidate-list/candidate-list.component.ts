import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-candidate-list',
    templateUrl: './candidate-list.component.html',
    styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {
        const token = sessionStorage.getItem('token');
        if (!token) {
            this.router.navigateByUrl('/login');
        }
    }
}
