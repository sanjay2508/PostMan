import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { FriendsearchComponent } from './appLayout/friendsearch/friendsearch.component';
import { AuthGuard } from './auth.guard';
import { FriendrequestComponent } from './appLayout/friendrequest/friendrequest.component';


const routes: Routes = [
  { path: '', pathMatch: 'prefix', redirectTo: 'login' },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'friendsearch', component: FriendsearchComponent, canActivate: [AuthGuard] },
  { path: 'friendrequest', component: FriendrequestComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'post', component: PostListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
