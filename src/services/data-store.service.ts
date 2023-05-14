import { Injectable } from '@angular/core';
import { IJob } from '../models/job.model';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
    providedIn: 'root',
})
export class DataStoreService {
    jobsData: BaseResponse<IJob[]>;
    searchText = '';
    categoryId: number;
    constructor() {}

    public resetData() {
        this.searchText = '';
        this.categoryId = 0;
    }
}
