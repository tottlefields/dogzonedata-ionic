import { Dog } from 'src/app/models/dog.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.page.html',
  styleUrls: ['./dog-detail.page.scss'],
})
export class DogDetailPage implements OnInit, OnDestroy {

  public dog;
  public weights;
  microchip: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dogsService: DogsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/']);
        return;
      }

      this.route.data.subscribe((data: {dog: Dog}) => {
        this.dog = data.dog;
        this.microchip = this.dog.microchip;
        if (this.microchip){
          this.microchip = this.microchip.match(/.{1,3}/g).join(' ');
        }
        // console.log(this.dog);
      });
      this.weights = this.dogsService.getAllWeights(paramMap.get('dogId')).valueChanges();
    });
  }

  ngOnDestroy(): void {
  }
}
