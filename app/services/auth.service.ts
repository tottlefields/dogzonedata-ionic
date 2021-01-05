import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

// import { auth } from 'firebase/app';
// import 'firebase/auth';
import firebase from 'firebase/app';
import { takeUntil } from 'rxjs/operators';

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
    private afStore: AngularFirestore,
    private router: Router,
  ) { 
  }

  signIn({email, password}) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  resetPw(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async logOut(){
    await this.afAuth.signOut();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.router.navigate(['/']);
    // this.afAuth.signOut().then(() => this.router.navigate(['/']));
  }

  getUserData() {
    return this.afStore.collection('users').doc<User>(this.getUserId()).valueChanges().pipe(takeUntil(this.unsubscribe));
  }

  getUserId() {
    // console.log(firebase.auth().currentUser.uid);
    return firebase.auth().currentUser.uid;
  }
}
