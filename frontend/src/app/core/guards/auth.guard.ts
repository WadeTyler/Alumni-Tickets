import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: "root"
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // Check if user has logged in before
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");
    const redirectTo = hasLoggedIn ? '/login' : '/signup';

    return this.authService.getUser().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate([redirectTo], {
            queryParams: {
              continueTo: state.url
            }
          });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate([redirectTo]);
        return of(false);
      })
    )
  }
}
