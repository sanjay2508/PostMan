import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private authListenerSubscription: Subscription;
    constructor(private authService: AuthService) { }

    newPost = 'Write your post here';

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe(isAuth => {
                this.isAuthenticated = isAuth;
            });
    }

    ngOnDestroy() {
        this.authListenerSubscription.unsubscribe();

    }

    onLogout() {
        this.authService.logout();
    }
}
