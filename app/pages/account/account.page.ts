import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: User = null;

  constructor(
    // private afAuth: AngularFireAuth,
    // private router: Router,
    private dogsService: DogsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserData().subscribe((user) => {
      this.user = user;
    });
  }


  signOut() {
    this.dogsService.logOut();
    this.authService.logOut();
  }

  /*async signOut() {
    await this.afAuth.signOut();
    // this.authService.unsubscribe.next();
    // this.authService.unsubscribe.complete();
    this.router.navigate(['/']);
  }*/
}
