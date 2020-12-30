import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplitPaneService } from './services/split-pane.service';
import { DogsService } from './services/dogs.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  dogs: any;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    public dogsService: DogsService,
    public spService: SplitPaneService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  signOut() {
    this.dogsService.logOut();
    this.authService.logOut();
  }
}
