import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';
import { Dog } from 'src/app/models/dog.interface';
import { Event } from 'src/app/models/event.interface';
import { DogsService } from 'src/app/services/dogs.service';
import { GeneralService } from 'src/app/services/general.service';
import { AddWeightComponent } from '../../stats/add-weight/add-weight.component';
import { NgForm } from '@angular/forms';
import { AddReminderComponent } from '../../schedule/add-reminder/add-reminder.component';
import { AddEventComponent } from '../../schedule/add-event/add-event.component';
import { Reminder } from 'src/app/models/reminder.interface';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.page.html',
  styleUrls: ['./dog.page.scss'],
})
export class DogPage implements OnInit {

  public dog;
  // microchip: string;
  microchip = {'num': '', 'provider' : '', 'url': ''};
  age: number;
  birthDate: string;
  health : any;
  healthData = [];
  sportsList: string[];
  genericPaw = '../../assets/img/generic-paw.png';
  formData: NgForm;
  diaryItems = [];
  overdueReminders = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dogsService: DogsService,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/']);
        return;
      }

      this.sportsList = environment.dogSports;

      this.route.data.subscribe((data: {dog: Dog}) => {
        this.dog = data.dog;
        // console.log(this.dog);

        if (this.dog.colorText == '#000000'){ this.genericPaw = '../../assets/img/generic-paw-black.png'; }

        if (this.dog.color && !this.dog.cssColor){
          let color = this.generalService.getColor(this.dog.color);
          if (color){ this.dog.cssColor = color.cssColor; }
          console.log('updating dog with new css color class...')
          this.dogsService.updateDog(this.dog.id, this.dog);
        }

        if (this.dog.microchip){
          if (typeof this.dog.microchip !== 'object'){
            this.dog.microchip = {
              'num' : this.dog.microchip,
              'provider' : '',
            };
            console.log('updating dog with new microchip format...')
            this.dogsService.updateDog(this.dog.id, this.dog);
          }
          if (this.dog.microchip.num){
            this.microchip = {
              'num' : this.dog.microchip.num.toString().match(/.{1,3}/g).join(' '),
              'provider' : this.dog.microchip.provider,
              'url' : environment.microchipProviders[this.dog.microchip.provider]
            }
          }
        }

        if (this.dog.dob){
          this.birthDate = moment(this.dog.dob.toDate()).format("Do MMMM");
          this.age = moment().diff(this.dog.dob.toDate(), 'years');
          /* this.dogsService.addBirthday(
            this.dog.id, 
            moment(this.dog.dob.toDate()).add((this.age +1 ), 'years').toDate(),
            this.generalService.capitalizeWords(this.dog.name) + '\'s ' + this.generalService.getOrdinal(this.age + 1) + ' Birthday',
            ); */
        }
        // console.log(this.dog);
      });

      
      this.dogsService.getOverdueRemindersForDog(this.dog.id).subscribe(data => {
        this.overdueReminders = [];
        data.forEach((reminder: Reminder) => {
          reminder.overdue = true;
          this.overdueReminders.push(reminder);
        });
      });

      this.dogsService.getUpcomingForDog(this.dog.id).subscribe(data => {
        this.diaryItems = [];
        data.forEach(e => {
          if (moment().diff(e.date.toDate(), 'years') == 0){ e.thisYear = true; }
          else { e.thisYear = false; }
          this.diaryItems.push(e);
        })
      });

      this.healthData = [];
      let bvaSeen = 0
      let hipsSeen = 0
      this.dogsService.getHealthData(this.dog.id).valueChanges().subscribe(data =>{
        // console.log(data);
        for (let entry of data) {
            if (!bvaSeen && entry.type == 'bva-eye'){
              bvaSeen = 1;
              this.healthData.push({label: 'BVA Eye Test', note : moment(entry.date.toDate()).format('DD/MM/YY') });
            }
            if (!hipsSeen && entry.type == 'hip-score'){
              // console.log(entry);
              hipsSeen = 1;
              this.healthData.push({label: 'Hip Score', note : entry.result});
            }
          }
      });
      // console.log(this.healthData);
    });
  }

  async visitWebsite(event, url:string) {
    event.stopPropagation();
    await Browser.open({ url: url });
  }

  addWeight(){
    console.log('adding weight from dog page...');
  }

  async onShowAddWeightModal() {
    console.log('adding weight from dog page...');
    this.modalCtrl
      .create({ component: AddWeightComponent, componentProps: { dog: this.dog } })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        // console.log(resultData);
        this.formData = resultData.data;
        if (resultData.role === 'addWeight') {
          // let dogData = this.formData.value.dog;
          const dogId = this.dog.id;
          const date = new Date(this.formData.value.date);
          const weight = this.formData.value.weight;
          // const name = this.dog.name;
          // const color = this.dog.color;

          const loading = await this.loadingCtrl.create({
            message: 'Adding new weight record...'
          });
          await loading.present();

          this.dogsService.addWeightRecord(dogId, date, weight)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            );
        }
      });
  }

  async onShowAddEventModal() {
    this.modalCtrl
      .create({ component: AddEventComponent, componentProps: { dog: this.dog } })
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
    this.modalCtrl
      .create({ component: AddReminderComponent, componentProps: { dog: this.dog } })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
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
