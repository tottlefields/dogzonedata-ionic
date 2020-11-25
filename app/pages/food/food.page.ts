import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {

  @ViewChild('foodSlider') slider: IonSlides;
  public daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public today: string;
  private currentDate = new Date();
  slideOpts = {
    initialSlide: 5,
    speed: 400
  };

  constructor() {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.today = weekdays[this.currentDate.getDay()];
    this.slideOpts.initialSlide = this.currentDate.getDay() - 1;
  }

  ngOnInit() {
  }

  ionViewDidLeave() {
    // console.log('left food page - reset slider to current day');
    this.slider.slideTo(this.currentDate.getDay() - 1);
  }

}
