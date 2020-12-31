import { Component, Input, OnInit } from '@angular/core';
import { Dog } from 'src/app/models/dog.interface';

@Component({
  selector: 'app-dates-card',
  templateUrl: './dates-card.component.html',
  styleUrls: ['./dates-card.component.scss'],
})
export class DatesCardComponent implements OnInit {
  @Input() dog: Dog;
  @Input() diaryItems: any[];

  constructor() { }

  ngOnInit() {}

}
