import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeOneComponent } from './components/pages/home-one/home-one.component';
import { JobListComponent } from './components/pages/job-list/job-list.component';
import { JobDetailsComponent } from './components/pages/job-details/job-details.component';
import { PostAJobComponent } from './components/pages/post-a-job/post-a-job.component';
import { SubmitResumeComponent } from './components/pages/submit-resume/submit-resume.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { CandidateListComponent } from './components/pages/candidate-list/candidate-list.component';
import { CandidateDetailsComponent } from './components/pages/candidate-details/candidate-details.component';

const routes: Routes = [
    { path: '', component: HomeOneComponent },
    { path: 'job-list', component: JobListComponent },
    { path: 'job-detail/:id', component: JobDetailsComponent },
    { path: 'post-a-job', component: PostAJobComponent },
    { path: 'candidate-list', component: CandidateListComponent },
    { path: 'candidate-details', component: CandidateDetailsComponent },
    // { path: 'single-resume', component: SingleResumeComponent },
    { path: 'submit-resume', component: SubmitResumeComponent },
    { path: 'login', component: LoginComponent },
    { path: '404', component: ErrorComponent },
    { path: '**', component: ErrorComponent }, // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
