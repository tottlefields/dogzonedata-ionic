import { DogsService } from 'src/app/services/dogs.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplitPaneService } from './services/split-pane.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    public spService: SplitPaneService,
    public authService: AuthService,
    private dogsService: DogsService,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log(this.platform.is('tablet'));
    this.platform.ready().then(() => {
      /* this.afAuth.onAuthStateChanged(user => {
        if (user) {
          console.log(user);
          this.authService.currentUser = user;
          this.authService.dogs = this.dogsService.getDogList(user.uid).valueChanges();
          //this.router.navigate(['/dzd/dogs']);
          //this.router.navigateByUrl('/');
          this.splashScreen.hide();
        }
        else {
          this.router.navigateByUrl('/auth');
          this.splashScreen.hide();
        }
      }); */
      if (Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
      // this.splashScreen.hide();
      // this.statusBar.styleDefault();
    });
  }

  doLogout() {
    this.authService.logoutUser();
    this.router.navigateByUrl('/auth');
  }
}
