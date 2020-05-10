import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuthentic = false;
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.isAuthentic = this.authService.getIsAuth();

    if (!this.isAuthentic) {
      this.router.navigate(['login']);
    }
    return true;
  }

}
