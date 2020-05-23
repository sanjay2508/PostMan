import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { EmailValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LoggedUserInfo } from './loggedUserInfo';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private userId: string;
    private userName: string;
    private loggedUserInfo = { _id: null, name: null, email: null, friendsRequest: null } as LoggedUserInfo;
    private authStatusListener = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getLoggedUserInfo() {
        console.log('in auth service', this.loggedUserInfo);
        return this.loggedUserInfo;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    async createUser(name: string, email: string, password: string) {
        const authData: AuthData = {
            name,
            email,
            password
        };

        const response: any = await this.httpClient.post('http://localhost:3000/api/auth/signup', authData)
            .toPromise();

        return response.status;
    }
    async login(email: string, password: string) {
        const authData: { email: string, password: string } = {
            email,
            password
        };
        // tslint:disable-next-line: max-line-length
        try {
            // tslint:disable-next-line: max-line-length
            const response: any = await this.httpClient.post<{ token: string, expiresIn: number, userName: string, userId: string, userEmail: string, friendsRequest: [string] }>('http://localhost:3000/api/auth/login', authData, { withCredentials: true })
                .toPromise();

            console.log(response);

            this.token = response.token;
            this.userId = response.userId;
            this.userName = response.userName;
            this.loggedUserInfo._id = response.userId;
            this.loggedUserInfo.name = response.userName;
            this.loggedUserInfo.email = response.userEmail;
            this.loggedUserInfo.friendsRequest = response.friendsRequest;

            const token = response.token;
            if (token) {
                const expireInDuration = response.expiresIn;
                this.tokenTimer = setTimeout(() => {
                    this.logout();
                }, expireInDuration * 10000);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userName, this.userId);
                this.router.navigate(['/']);
            }
            return response;
        } catch (err) {
            console.log(err);
            if (err.error === 'Auth Failed:Password Incorrect') {
                return { Status: 'Failed', message: 'Password Incorrect' };
            }
            if (err.error === 'Auth Failed:User Not found') {
                return { Status: 'Failed', message: 'User Not found' };
            }
            return { Status: err.Error };
        }
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return;
        }
        const now = new Date();
        const isInFuture = authInfo.expirationDate > now;
        if (isInFuture) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userName = authInfo.userName;
            this.userId = authInfo.userId;
            this.authStatusListener.next(true);
            this.tokenTimer = setTimeout(() => {
                this.logout();
            }, (authInfo.expirationDate.getTime() - now.getTime()) / 100);
        }
    }

    logout() {
        this.userId = null;
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, userName: string, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userName', userName);
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate),
            userName,
            userId
        };
    }

    async changePassword(emailId: string) {
        const email: any = {
            emailId
        };

        const response: any = await this.httpClient.post('http://localhost:3000/api/user/sendEmail', email)
            .toPromise();

        return response.status;
    }

    async getUsersEmail() {
        const response: any = await this.httpClient.get('http://localhost:3000/api/user')
            .toPromise();
        return response.Users;
    }

    async sendFriendRequest(requestFrom: string, requestTo: string) {
        const info: any = {
            requestFrom,
            requestTo
        };
        try {
            const response: any = await this.httpClient.post('http://localhost:3000/api/user/friendRequest', info)
                .toPromise();
            return response;
        } catch (err) {
            return err;
        }
    }

    async acceptFriendRequest(requestFrom: string, requestTo: string) {
        const info: any = {
            requestFrom,
            requestTo
        };
        try {
            const response: any = await this.httpClient.post('http://localhost:3000/api/user/acceptFriendRequest', info)
                .toPromise();
            return response;
        } catch (err) {
            this.loggedUserInfo.friendsRequest.forEach((item, index) => {
                console.log('deleting elemet', item, requestFrom);
                if (item === requestFrom[0]) {
                    console.log(item, requestFrom);
                    this.loggedUserInfo.friendsRequest.splice(index, 1);
                }
            });
            console.log(this.loggedUserInfo.friendsRequest);
            return err;
        }
    }
}
