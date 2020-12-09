import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ControlContainer } from '@angular/forms';
import { Router } from '@angular/router';
import { from, Subject } from 'rxjs';

// import { auth } from 'firebase/app';
// import 'firebase/auth';
import firebase from 'firebase/app';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  unsubscribe: Subject<void> = new Subject<void>();

  public dogs: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  signIn({email, password}) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  resetPw(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logOut(){
    this.afAuth.signOut().then(() => this.router.navigate(['/']));
  }

  getUserId() {
    // console.log(firebase.auth().currentUser.uid);
    return firebase.auth().currentUser.uid;
  }
}
