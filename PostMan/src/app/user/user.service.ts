import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private httpClient: HttpClient) { }

    async getUsersEmail() {
        const response: any = await this.httpClient.get('http://localhost:3000/api/user')
            .toPromise();
        return response.Users;
    }

    async getLoggedInUserInfo() {
        const response: any = await this.httpClient.get('http://localhost:3000/api/user/userInfo')
            .toPromise();
        return response.userInfo;
    }
    async getUserInfo(userId: string) {
        const response: any = await this.httpClient.get('http://localhost:3000/api/user/userInfo')
            .toPromise();
        return response.userInfo;
    }

}
