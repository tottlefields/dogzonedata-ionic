import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async signOut() {
    await this.afAuth.signOut();
    // this.authService.unsubscribe.next();
    // this.authService.unsubscribe.complete();
    this.router.navigate(['/']);
  }

}
