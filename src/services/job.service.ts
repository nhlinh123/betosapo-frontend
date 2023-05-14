import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../models/base-response.model';
import { IJob, JobsByTypeRequest, SearchJobRequest } from '../models/job.model';

@Injectable({
    providedIn: 'root',
})
export class JobService {
    private apiUrl = environment.API_URL;
    private path = 'api/job';
    constructor(private http: HttpClient) {}

    createJob(body: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/${this.path}/create`, body);
    }

    getNewestJobs() {
        return this.http.get(`${this.apiUrl}/${this.path}/getNewestJobs`).pipe(
            map((rs: BaseResponse<IJob[]>) => {
                return {
                    code: rs.code,
                    data: rs.data.map((item) => {
                        return this.transformJob(item);
                    }),
                };
            })
        );
    }

    getJobsByType(body: JobsByTypeRequest) {
        return this.http
            .post(`${this.apiUrl}/${this.path}/getJobsByType`, body)
            .pipe(
                map((rs: BaseResponse<IJob[]>) => {
                    return {
                        code: rs.code,
                        data: rs.data.map((item) => {
                            return this.transformJob(item);
                        }),
                    };
                })
            );
    }

    searchJobsByTypeAndTitle(body: SearchJobRequest): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/${this.path}/searchJobsByTypeAndTitle`, body)
            .pipe(
                map((rs: BaseResponse<IJob[]>) => {
                    return {
                        code: rs.code,
                        data: rs.data.map((item) => {
                            return this.transformJob(item);
                        }),
                        total: rs.total,
                        left: rs.left,
                    } as BaseResponse<any>;
                })
            );
    }

    private transformJob(item: IJob) {
        const picturesString = item.PicturePath.replace(
            /C:\\Works\\betosapo-api\\src\\/g,
            this.apiUrl + '/'
        ).replace(/\\/g, '/');
        const pictureArray = picturesString.split(',');
        return {
            ...item,
            PicturePath: pictureArray,
            firstPicture: pictureArray[0],
            JobType:
                item?.JobType === 'FULLTIME' ? 'フルタイム' : 'パートタイム',
        };
    }
}
