import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any;
  private user: AuthData;
  private userUpdated = new Subject<AuthData>();
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() { return this.token; }
  getUserId() { return this.userId; }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(firstName: string, email: string, password: string) {
    const authData: AuthData = {firstName: firstName, email: email, password: password};
    this.httpClient.post('http://localhost:3000/api/users/signup', authData)
    .subscribe(() => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  updateUser(id: string, firstName: string, email: string, password: string) {
    const authData = {id: id, firstName: firstName, email: email, password: password};
    this.httpClient.put('http://localhost:3000/api/users/' + id, authData)
    .subscribe(() => {
      console.log('USER UPDATED');
      this.router.navigate(['/profile']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  getUser(id: string) {
    console.log('GET USER CALLED');
    return this.httpClient.get<{_id: string, firstName: string, email: string, password: string}>('http://localhost:3000/api/users/' + id);
  }

  autoAuthenticateUser() {
    const authInformation = this.getLocalAuthData();
    if (!authInformation) { return; }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0 ) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);

    }
  }

  login(email: string, password: string) {
    const authData = {email: email, password: password};
    this.httpClient.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/users/login', authData)
    .subscribe(response => {
      const userId = response.userId;
      this.userId = userId;
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresDuration = response.expiresIn;
        this.setAuthTimer(expiresDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
        this.saveLocalAuthData(token, expirationDate, userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, duration * 1000);
  }

  private saveLocalAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearLocalAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getLocalAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expiration');

    if ( !token || !expirationDate) { return; }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };

  }
}
