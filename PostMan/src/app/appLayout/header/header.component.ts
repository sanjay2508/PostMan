import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { LoggedUserInfo } from 'src/app/auth/loggedUserInfo';

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
    constructor(private authService: AuthService) { }

    newPost = 'Write your post here';

    selected: string;
    states: string[] = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois'];

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

    onLogout() {
        this.authService.logout();
    }
}
