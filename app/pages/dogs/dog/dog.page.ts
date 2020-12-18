import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

import { Dog } from 'src/app/models/dog.interface';
import { DogsService } from 'src/app/services/dogs.service';

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

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dogsService: DogsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/']);
        return;
      }

      this.route.data.subscribe((data: {dog: Dog}) => {
        this.dog = data.dog;
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
              console.log(entry);
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

}
