import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dog-picker',
  templateUrl: './dog-picker.component.html',
  styleUrls: ['./dog-picker.component.scss'],
})
export class DogPickerComponent implements OnInit {
  
  // @Output() dogPick = new EventEmitter<string>();
  @Input() dogList: any;

  constructor() { }

  ngOnInit() {}

}
