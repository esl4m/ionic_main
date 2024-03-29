import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from  './user';
import { AuthResponse } from  './auth-response';
 
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
 
const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  AUTH_SERVER_ADDRESS: string = environment.apiURL;

  constructor( private http: HttpClient ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
 
  login(user: User): Observable<AuthResponse> {
    return this.http.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
      tap(async (res : AuthResponse) => {
        Storage.set({ key: TOKEN_KEY, value: res.user.access_token })
        Storage.set({ key: "name", value: res.user.name })
        Storage.set({ key: "email", value: res.user.email })
        Storage.set({ key: "role", value: res.user.role })
        this.isAuthenticated.next(true);
      })
    )
  }

  register(credentials: User): Observable<any> {
    return this.http.post(`${this.AUTH_SERVER_ADDRESS}/register`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        // this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    Storage.remove({key: 'name'});
    return Storage.remove({key: TOKEN_KEY});
  }
}
