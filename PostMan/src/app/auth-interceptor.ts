import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        if (authToken) {
            const authRequest = req.clone({
                headers: req.headers.set('Authorization', authToken)
            });
            return next.handle(authRequest);
        }
        return next.handle(req);
    }
}
