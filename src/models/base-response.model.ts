export class BaseResponse<T> {
    data: T;
    status: string;
    constructor(res: Partial<any>) {
        this.data = res?.data;
        this.status = res?.status;
    }
}
