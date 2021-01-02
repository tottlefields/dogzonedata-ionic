import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dog-picker',
  templateUrl: './dog-picker.component.html',
  styleUrls: ['./dog-picker.component.scss'],
})
export class DogPickerComponent implements OnInit {
  
  @Input() dogList: any;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() { }

  
  updateCheckControl(cal, o) {
    if (o.checked) {
      cal.push(new FormControl(o.value));
    } else {
      cal.controls.forEach((item: FormControl, index) => {
        if (item.value == o.value) {
          cal.removeAt(index);
          return;
        }
      });
    }
  }

  onSelectionChange(e, i) {
    const checkboxArrayList: FormArray = this.form.get('dogsList') as FormArray;
    this.dogList[i].checked = e.target.checked;
    this.updateCheckControl(checkboxArrayList, e.target);
  }

}
