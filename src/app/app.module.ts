import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/common/preloader/preloader.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { HomeOneComponent } from './components/pages/home-one/home-one.component';
import { HomeTwoComponent } from './components/pages/home-two/home-two.component';
import { HomeThreeComponent } from './components/pages/home-three/home-three.component';
import { AboutComponent } from './components/pages/about/about.component';
import { JobListComponent } from './components/pages/job-list/job-list.component';
import { FavouriteJobComponent } from './components/pages/favourite-job/favourite-job.component';
import { JobDetailsComponent } from './components/pages/job-details/job-details.component';
import { PostAJobComponent } from './components/pages/post-a-job/post-a-job.component';
import { CandidateListComponent } from './components/pages/candidate-list/candidate-list.component';
import { CandidateDetailsComponent } from './components/pages/candidate-details/candidate-details.component';
import { SingleResumeComponent } from './components/pages/single-resume/single-resume.component';
import { SubmitResumeComponent } from './components/pages/submit-resume/submit-resume.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CompanyListComponent } from './components/pages/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/pages/company-details/company-details.component';
import { LoginComponent } from './components/pages/login/login.component';
import { CreateAccountComponent } from './components/pages/create-account/create-account.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SingleProfileComponent } from './components/pages/single-profile/single-profile.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { TermsAndConditionsComponent } from './components/pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { AuthService } from '../services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CategoryService } from '../services/category.service';
import { NiceSelectModule } from 'ng-nice-select';
import { NotifierModule } from 'angular-notifier';
import { TooltipModule } from 'ng2-tooltip-directive';
import { HeaderComponent } from './components/common/header/header.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
    declarations: [
        AppComponent,
        PreloaderComponent,
        NavbarComponent,
        FooterComponent,
        HomeOneComponent,
        HomeTwoComponent,
        HomeThreeComponent,
        AboutComponent,
        JobListComponent,
        FavouriteJobComponent,
        JobDetailsComponent,
        PostAJobComponent,
        CandidateListComponent,
        CandidateDetailsComponent,
        SingleResumeComponent,
        SubmitResumeComponent,
        PricingComponent,
        DashboardComponent,
        CompanyListComponent,
        CompanyDetailsComponent,
        LoginComponent,
        CreateAccountComponent,
        ProfileComponent,
        SingleProfileComponent,
        ErrorComponent,
        FaqComponent,
        TermsAndConditionsComponent,
        PrivacyPolicyComponent,
        ContactComponent,
        BlogDetailsComponent,
        BlogComponent,
        HeaderComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NiceSelectModule,
        FormsModule,
        NotifierModule,
        TooltipModule,
        IvyCarouselModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AuthService,
        CategoryService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
