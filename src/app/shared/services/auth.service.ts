import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthService {

  loggedIn = false
  username = ''
  system = ''
  systems = []
  modules = []

  constructor(private router: Router) { }

  logIn(login: string, passord: string) {
    this.loggedIn = true;
    this.router.navigate(['/']);
  }

  logOut() {
    this.loggedIn = false
    this.username = ''
    this.system = ''
    this.systems = []
    this.modules = []
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

}

@Injectable()
export class AuthGuardService implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    const isLoginForm = route.routeConfig.path === 'login-form';

    if (isLoggedIn && isLoginForm) {
        this.router.navigate(['/']);
        return false;
    }

    if (!isLoggedIn && !isLoginForm) {
        this.router.navigate(['/login']);
    }

    return isLoggedIn || isLoginForm;
  }

}
