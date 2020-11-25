import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SplitPaneService {
  splitPaneState: boolean;

  constructor(public platform: Platform) {
    this.splitPaneState = false;
  }

  setSplitPane(state: boolean) {
    if (this.platform.width() > 768) {
      // console.log('here');
      this.splitPaneState = state;
    } else {
      this.splitPaneState = true;
    }
    // console.log(this.splitPaneState);
  }

  getSplitPane() {
    // console.log(this.splitPaneState);
    return this.splitPaneState;
  }
}
