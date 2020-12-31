import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/models/event.interface';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent implements OnInit {
  @Input() event: any;

  constructor() {}

  ngOnInit() {}
}
