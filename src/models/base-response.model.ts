export class BaseResponse<T> {
    data?: T;
    status?: string;
    message?: string;
    code?: string;
    total?: number;
    left: number;
    constructor(res: Partial<any>) {
        this.data = res?.data;
        this.status = res?.status;
        this.message = res?.message;
        this.code = res?.code;
        this.total = res?.total;
        this.left = res?.left;
    }
}
