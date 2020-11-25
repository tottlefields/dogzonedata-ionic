import { DogsService } from './dogs.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

export interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User = null;
  public dogs: any;

  constructor(public afAuth: AngularFireAuth, public dogsService: DogsService) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        if (!this.currentUser){ this.currentUser = user; }
        if (!this.dogs) { this.dogs = this.dogsService.getDogList(this.currentUser.uid).valueChanges(); }
      } else {
        // No user is signed in.
        this.currentUser = null;
        this.dogs = null;
      }
    });
  }

  loginUser(email: string, pass: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, pass)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            console.log('LOG Out');
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  // private storeAuthData(uid: string)
}
