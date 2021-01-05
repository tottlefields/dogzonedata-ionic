import { Component, Input, OnInit } from '@angular/core';
import { Dog } from 'src/app/models/dog.interface';
import { Reminder } from 'src/app/models/reminder.interface';

@Component({
  selector: 'app-dates-card',
  templateUrl: './dates-card.component.html',
  styleUrls: ['./dates-card.component.scss'],
})
export class DatesCardComponent implements OnInit {
  @Input() dog: Dog;
  @Input() diaryItems: any[];
  @Input() overdueReminders: Reminder[];

  constructor() { }

  ngOnInit() {}

}
