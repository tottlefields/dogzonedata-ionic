import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  type: string;

  constructor() {
    this.type = 'calendar';
  }

  ngOnInit() {
  }

}
