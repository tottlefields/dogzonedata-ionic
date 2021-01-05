import { LoadingController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss'],
})
export class ReminderItemComponent implements OnInit {
  @Input() reminder: any;
  // @Output() undoStatus = new EventEmitter<boolean>();
  @Output() reminderId = new EventEmitter<string>();

  constructor(
    private dogsService: DogsService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  async completeReminder(event){
    if (event.detail.checked){
      const loading = await this.loadingCtrl.create({ duration: 5000, });
      await loading.present();

      // this.reminderId.emit(event.detail.value);
      // loading.dismiss();
      this.reminderId.emit(event.detail.value);

      this.dogsService.completeReminder(event.detail.value).then(
        () => { loading.dismiss(); },
        error => { console.log(error); }
      ); 
    }
  }

}
