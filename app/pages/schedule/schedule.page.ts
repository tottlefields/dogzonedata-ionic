import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';

import { DogsService } from 'src/app/services/dogs.service';
import { GeneralService } from 'src/app/services/general.service';
import { AddEventComponent } from './add-event/add-event.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { Event } from 'src/app/models/event.interface';
import { Reminder } from 'src/app/models/reminder.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  type: string;
  undoHidden: boolean;
  lastReminder: string;
  public diaryItems = [];
  public reminders = {};
  public overdueReminders = [];
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
    this.undoHidden = true;
    //this.type = 'reminders';
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


      this.dogsService.getOverdueReminders().subscribe(
        data => {
          this.overdueReminders = [];
          data.forEach((reminder: Reminder) => {
            reminder.overdue = true;
            if (reminder.dogs.length > 0){
              this.getDogChips(reminder);
            }
            this.overdueReminders.push(reminder);
          });
        });

      this.dogsService.getEvents().subscribe(
        data => {
          this.diaryItems = data;
          this.events = [];
          this.reminders = {};
          data.forEach((event: Event) => {
            if (event.type == 'reminder'){ 
              if (moment(event.date.toDate()).isSame(new Date(), 'month')){ 
                //true if dates are in the same month
                if (!this.reminders['This Month']){ this.reminders['This Month'] = []; }
                this.reminders['This Month'].push(event);
              } else if ((moment(event.date.toDate()).subtract('1', 'months')).isSame(new Date(), 'month')){ 
                //true if date is next month
                if (!this.reminders['Next Month']){ this.reminders['Next Month'] = []; }
                this.reminders['Next Month'].push(event);
              } else if (moment(event.date.toDate()).isSame(new Date(), 'year')){ 
                //true if dates are in the same year
                if (!this.reminders['This Year']){ this.reminders['This Year'] = []; }
                this.reminders['This Year'].push(event);
              }
              else {
                if (!this.reminders['Next Year']){ this.reminders['Next Year'] = []; }
                this.reminders['Next Year'].push(event);
              }
            } else {
              this.events.push(event); 
            }

            if (event.dogs.length > 0){
              this.getDogChips(event);
            }
          })
        }
      );

      /* this.dogsService.getEvents().subscribe(
        data => {
          this.diaryItems = data;
          this.events = [];
          this.reminders = [];
          data.forEach((event: Event) => {
            if (event.type != 'reminder'){ this.events.push(event); }

            if (event.dogs.length > 0){
              this.getDogChips(event);
            }
          })
        }
      );

      this.dogsService.getReminders().subscribe(
        data => {
          this.reminders = [];
          data.forEach((reminder: Reminder) => {
            this.reminders.push(reminder);
            if (reminder.dogs.length > 0){
              this.getDogChips(reminder);
            }
          });
        }); */

    }); // end of this.dogsService.getDogs().subscribe()
  }

  getDogChips(event: any){
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

  segmentChanged(event) {
    this.type = event.detail.value;
    if (this.type == 'calendar'){ this.undoHidden = true; }
  }

  undoAction(event){
    // console.log(this.lastReminder);
    this.dogsService.undoCompleteReminder(this.lastReminder);
    this.lastReminder = '';
    this.undoHidden = true;
  }

  updateUndoState(event){
    this.lastReminder = event;
    this.undoHidden = false;
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
          // handler: () => {
          //  console.log('Cancel clicked');
          // }
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
          await loading.present();

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
          const date = new Date(this.formData.value.date);
          const title = this.formData.value.title;
          const dogs = this.formData.value.dogsList;

          const loading = await this.loadingCtrl.create({
            message: 'Adding new reminder...'
          });
          await loading.present();

          this.dogsService.addReminder(dogs, date, title)
          .then(() => { loading.dismiss(); },
            error => { console.error(error); }
          );
        }
      });
  }

}
