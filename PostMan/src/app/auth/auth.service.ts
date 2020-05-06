import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { EmailValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private userId: string;
    private userName: string;
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

    getUserName() {
        return this.userName;
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
        const response: any = await this.httpClient.post<{ token: string, expiresIn: number, userName: string, UserId: string }>('http://localhost:3000/api/auth/login', authData, { withCredentials: true })
            .toPromise();

        this.token = response.token;
        this.userId = response.userId;
        this.userName = response.userName;

        const token = response.token;
        if (token) {
            const expireInDuration = response.expiresIn;
            this.tokenTimer = setTimeout(() => {
                this.logout();
            }, expireInDuration * 1000);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userName, this.userId);
            this.router.navigate(['/']);
        }
        return response;
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

        const response: any = await this.httpClient.post('http://localhost:3000/api/auth/sendEmail', email)
            .toPromise();

        return response.status;
    }

}
