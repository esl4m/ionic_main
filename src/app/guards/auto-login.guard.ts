import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated){
      return this.authService.isAuthenticated.pipe(
        filter(val => val !== null), // Filter out initial Behaviour subject value
        take(1), // Otherwise the Observable doesn't complete!
        map(isAuthenticated => {
          if (isAuthenticated) {
            console.log('Found previous token, automatic login');
            this.router.navigateByUrl('/home', { replaceUrl: true });
          } else {
            // Simply allow access to the login
            return true;
          }
        })
      );
    }
    else {
      this.router.navigateByUrl('/home');
    }
  }
}
