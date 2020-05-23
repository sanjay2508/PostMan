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
}
