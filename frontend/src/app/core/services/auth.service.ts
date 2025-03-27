import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from 'rxjs';
import {AuthRequest, User} from '../../../../../types/auth.types';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();
  private apiURL = environment.apiUrl;

  // STATES
  public isLoggingIn: boolean = false;
  public loginError: string = '';

  constructor(private http: HttpClient) {
    this.getUser();
  }

  // Fetch the user from the server using authToken credential
  public getUser(): Observable<User | null> {
    return this.http.get<any>(`${this.apiURL}/auth`, {withCredentials: true }).pipe(
      map(response => {
        if (response && response.user) {
          this.currentUserSubject.next(response.user);
          return response.user;
        } else {
          this.currentUserSubject.next(null);
          return null;
        }
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  // Attempt login
  public login(loginRequest: AuthRequest) {
    this.isLoggingIn = true;
    this.loginError = '';

    return this.http.post<any>(`${this.apiURL}/auth/login`, loginRequest, { withCredentials: true }).pipe(
      map(response => {
        console.log(response)
        if (response && response.user) {
          this.currentUserSubject.next(response.user);
          this.isLoggingIn = false;
          return response.user;
        } else {
          this.currentUserSubject.next(null);
          this.isLoggingIn = false;
          return null;
        }
      }),
      catchError((e) => {
        this.currentUserSubject.next(null);
        this.isLoggingIn = false;
        console.log(e);
        this.loginError = e.error.message || "Failed to login";
        return of(null);
      })
    );

  }
}
