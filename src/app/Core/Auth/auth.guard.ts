import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { FirebaseService } from '../Service/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: FirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isLoggedIn = this.authService.isAuthenticated();
    const isLoginRoute = route.routeConfig?.path === 'admin/login';

    if (isLoggedIn && isLoginRoute) {
      // If logged in and trying to access login → redirect to admin home
      return this.router.parseUrl('/admin/home');
    }

    if (!isLoggedIn && !isLoginRoute) {
      // If not logged in and trying to access admin → redirect to login
      return this.router.parseUrl('/admin/login');
    }

    return true; // Allow route access
  }
}
