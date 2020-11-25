import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavController } from '@ionic/angular';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.page.html',
  styleUrls: ['./dog-detail.page.scss'],
})
export class DogDetailPage implements OnInit, OnDestroy {

  public dog;
  public weights;

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

      this.dog = this.dogsService.getDog(paramMap.get('dogId')).valueChanges();
      this.weights = this.dogsService.getAllWeights(paramMap.get('dogId')).valueChanges();
    });
  }

  ngOnDestroy(): void {
  }
}
