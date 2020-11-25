import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private menuController: MenuController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
    // this.splitPaneService.setSplitPane(false);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      this.authService.loginUser(email, password).then(
        resData => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/');
        },
        errRes => {
          loadingEl.dismiss();
          this.showAlert(errRes.message);
        }
      );
    });
  }

  /*authenticate(email: string, pass: string) {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      this.authService.authLogin(email, pass).subscribe(
        resData => {
          // console.log(resData);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/');
        },
        errRes => {
          loadingEl.dismiss();
          console.log(errRes);
          const code = errRes.error.error.message;
          let message = 'Could not login, please try again.';
          if (code === 'USER_DISABLED') {
            message = 'Your account has been disabled, please contact us.';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'E-Mail address could not be found.';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'This password is not correct.';
          }
          this.showAlert(message);
        }
      );
    });
  } */

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: msg,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
