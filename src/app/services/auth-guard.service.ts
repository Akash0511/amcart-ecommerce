import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in (you can implement your own logic here)
    const isLoggedIn = localStorage.getItem('accessToken') !== null;

    if (!isLoggedIn) {
      // User is not logged in, redirect to login/signup page
      // this.router.navigate(['/']);
      window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=http://localhost:4200/';
      return false;
    }
    return true;
  }
}
