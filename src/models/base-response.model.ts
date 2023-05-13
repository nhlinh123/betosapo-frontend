export class BaseResponse<T> {
    data?: T;
    status?: string;
    message?: string;
    code?: string;
    constructor(res: Partial<any>) {
        this.data = res?.data;
        this.status = res?.status;
        this.message = res?.message;
        this.code = res?.code;
    }
}
