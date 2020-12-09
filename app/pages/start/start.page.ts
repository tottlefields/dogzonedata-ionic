import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/core';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    public dogsService: DogsService,
    private router: Router,
    private alertCtrl: AlertController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  async openPrivacy(e){
    e.preventDefault();
    await Browser.open({ url: 'https://www.google.com/' });
  }

  async openTerms(e){
    e.preventDefault();
    await Browser.open({ url: 'https://www.google.com/' });
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const loading = await this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...'});
    await loading.present();

    this.authService.signIn(form.value).then(
        (res) => {
          loading.dismiss();
          this.router.navigateByUrl('/app');
        },
        async (err) => {
          loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Authentication failed',
            message: err.msg,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
  }

}
