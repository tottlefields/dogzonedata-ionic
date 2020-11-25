import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Dog } from 'src/app/models/dog.interface';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-edit-dog',
  templateUrl: './edit-dog.page.html',
  styleUrls: ['./edit-dog.page.scss'],
})
export class EditDogPage implements OnInit, OnDestroy {

  //dog: Dog;
  dog: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dogsService: DogsService
   ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/dzd/dogs/']);
        return;
      }

      this.dog = this.dogsService.getDog(paramMap.get('dogId')).valueChanges();
    });
  }

  ngOnDestroy(): void { }

}
