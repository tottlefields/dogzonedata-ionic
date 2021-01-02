import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';

import { DogsService } from 'src/app/services/dogs.service';
import { GeneralService } from 'src/app/services/general.service';
import { AddEventComponent } from './add-event/add-event.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { Event } from 'src/app/models/event.interface';
// import { DogPickerComponent } from 'src/app/shared/pickers/dog-picker/dog-picker.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  type: string;
  public diaryItems = [];
  public reminders = [];
  public events = [];
  dogLookup = {};
  public dogs: any;
  formData: NgForm;
  // @ViewChild('dogPicker', { static: false }) dogPicker: DogPickerComponent;

  constructor(
    private dogsService: DogsService,
    private generalService: GeneralService,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
  ) {
    this.type = 'calendar';
  }

  ngOnInit() {
    this.dogsService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
      for (let dog of this.dogs) {
        if (!this.dogLookup[dog.id]) {
          this.dogLookup[dog.id] = {
            label: this.generalService.capitalizeWords(dog.name),
            color: dog.color,
            cssColor: dog.cssColor,
            isRemoved: dog.isRemoved
          };
        }
      }
      this.dogsService.getEvents().subscribe(
        data => {
          this.diaryItems = data;
          this.events = [];
          this.reminders = [];
          data.forEach(event => {
            if (event.type == 'reminder'){ this.reminders.push(event); }
            else { this.events.push(event); }

            if (event.dogs.length > 0){
              event.colors = [];
              event.chips = [];
              event.dogs.forEach(dogId => {
                if (!this.dogLookup[dogId].isRemoved){
                  event.colors.push(this.dogLookup[dogId].color)
                  event.chips.push({
                    label: this.dogLookup[dogId].label, 
                    letter: this.dogLookup[dogId].label.substring(0,1), 
                    cssColor: this.dogLookup[dogId].cssColor 
                  })
                }
              });
            }
          })
        }
      );
    });
    // console.log(this.diaryItems);
    // if (event.type == 'reminder'){ this.reminders.push(event); }
    // else { this.events.push(event); }
    // console.log(this.events);
  }

  segmentChanged(event) {
    this.type = event.detail.value;
  }

  myHeaderFn(record: Event, recordIndex: number, records: Event[]) {
    if (recordIndex === 0) {
      return record.month;
    }

    if (records[recordIndex - 1].month !== record.month) {
      return record.month;
    }

    return null;
  }



  async addEvent() {
    const actionSheet = await this.actionSheetController.create({
      // header: ''
      buttons : [
        {
          text: 'Event',
          //icon: 'calendar',
          handler: () => {
            this.onShowAddEventModal();
          }
        },
        {
          text: 'Reminder',
          //icon: 'alert-circle',
          handler: () => {
            this.onShowAddReminderModal();
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async onShowAddEventModal() {
    this.modalCtrl
      .create({ component: AddEventComponent })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        // console.log(resultData);
        if (resultData.role === 'addEvent') {
          this.formData = resultData.data;
          console.log(this.formData.value);
          console.log(this.formData.value.date);

          const loading = await this.loadingCtrl.create({
            message: 'Adding new weight record...'
          });

/*           this.dogsService.addWeightRecord(dogId, date, weight)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            ); */
        }
      });
  }

  async onShowAddReminderModal() {
    console.log('add new reminder...');
    this.modalCtrl
      .create({ component: AddReminderComponent })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        // console.log(resultData);
        if (resultData.role === 'addReminder') {
          this.formData = resultData.data;
          console.log(this.formData.value);
          console.log(this.formData.value.date);

          // let dogData = this.formData.value.dog;
          // const dogId = dogData.id;
          const date = new Date(this.formData.value.date);
          const weight = this.formData.value.weight;

          const loading = await this.loadingCtrl.create({
            message: 'Adding new reminder...'
          });

/*           this.dogsService.addWeightRecord(dogId, date, weight)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            ); */
        }
      });
  }

}
