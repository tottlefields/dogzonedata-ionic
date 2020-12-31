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
        }
        // console.log(this.dog);
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

          this.dogsService.addWeightRecord(dogId, date, weight)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            );
        }
      });
  }

}
