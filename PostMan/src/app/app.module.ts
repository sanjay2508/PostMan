import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { MaterialModule } from './material.module';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth-interceptor';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NavBarComponent } from './appLayout/nav-bar/nav-bar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HeaderComponent } from './appLayout/header/header.component';
import { FriendsearchComponent } from './appLayout/friendsearch/friendsearch.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FriendrequestComponent } from './appLayout/friendrequest/friendrequest.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    NavBarComponent,
    FriendsearchComponent,
    FriendrequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
