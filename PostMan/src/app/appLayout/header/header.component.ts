import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private authListenerSubscription: Subscription;
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
        this.userName = this.authService.getUserName();
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe(isAuth => {
                this.isAuthenticated = isAuth;
                this.userName = this.authService.getUserName();
            });
    }

    ngOnDestroy() {
        this.authListenerSubscription.unsubscribe();

    }

    onLogout() {
        this.authService.logout();
    }
}
