import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      console.log(result);
    }).catch(
        error => {
          console.log(error);
        }
    );
    this.authChange.next(true);
    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      console.log(result);
    }).catch(
        error => {
          console.log(error);
        }
    );
    this.authChange.next(true);
    this.authSuccessfully();
  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
    this.isAuthenticated = true;
  }
}
