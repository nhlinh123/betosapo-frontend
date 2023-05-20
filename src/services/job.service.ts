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

    apply(body): Observable<any> {
        return this.http.post(`${this.apiUrl}/${this.path}/apply`, body);
    }

    getAllJobs(): Observable<any> {
        return this.http.get(`${this.apiUrl}/${this.path}/getAllJobs`);
    }

    getAllApplied(jobId, jobType, categoryId): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/${this.path}/getAllApplied`, {
                jobId,
                jobType,
                categoryId,
            })
            .pipe(
                map((rs: BaseResponse<any[]>) => {
                    return {
                        code: rs.code,
                        data: rs.data.map((item) => {
                            const path = item?.Path.replace(
                                environment.path,
                                this.apiUrl + '/'
                            ).replace(/\\/g, '/');
                            return {
                                ...item,
                                Path: path,
                            };
                        }),
                    } as BaseResponse<any>;
                })
            );
    }

    private transformJob(item: IJob) {
        const picturesString = this.replace(item.PicturePath);
        const pictureArray = picturesString?.split(',') ?? [];
        return {
            ...item,
            PicturePath: pictureArray,
            firstPicture: pictureArray[0] ?? null,
            JobType:
                item?.JobType === 'FULLTIME' ? 'フルタイム' : 'パートタイム',
        };
    }

    replace(path) {
        return path
            .replace(environment.path, this.apiUrl + '/')
            .replace(/\\/g, '/');
    }
}
