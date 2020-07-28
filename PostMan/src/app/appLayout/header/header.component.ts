import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { LoggedUserInfo } from 'src/app/auth/loggedUserInfo';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private authListenerSubscription: Subscription;
    loggedInUser: LoggedUserInfo;
    userName: string;
    constructor(private authService: AuthService, private router: Router) { }

    newPost = 'Write your post here';

    selected: string;

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.loggedInUser = this.authService.getLoggedUserInfo();
        this.userName = this.loggedInUser.name;
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe(isAuth => {
                this.isAuthenticated = isAuth;
                this.userName = this.authService.getLoggedUserInfo().name;
            });
    }

    ngOnDestroy() {
        this.authListenerSubscription.unsubscribe();

    }

    userProfile() {
        this.router.navigate(['/user'], { queryParams: { userId: this.loggedInUser.email } });
    }
    onLogout() {
        this.authService.logout();
    }

}
