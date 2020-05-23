import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<any> {

  constructor(private authService: AuthService, private router: Router) { }
  // tslint:disable-next-line: max-line-length
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }
}
