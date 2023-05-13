export interface IJob {
    Id: number;
    CreatedDate: string;
    UpdatedDate: any;
    Title: string;
    Description: string;
    CompanyName: string;
    Location: string;
    Salary: string;
    Number: number;
    Position: string;
    JobType: string;
    Status: string;
    UserId: number;
    CategoryId: number;
    PicturePath: string;
    firstPicture?: string;
}

export type JobsByTypeRequest = { type: string; limit: number; offset: number };
