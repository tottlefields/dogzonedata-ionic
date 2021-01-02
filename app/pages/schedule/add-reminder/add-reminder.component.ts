import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Dog } from 'src/app/models/dog.interface';
import { DogsService } from 'src/app/services/dogs.service';
// import { DogPickerComponent } from 'src/app/shared/pickers/dog-picker/dog-picker.component';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.scss'],
})
export class AddReminderComponent implements OnInit {
  public today: Date;
  public dogs: any;
  dog: Dog;
  reminderForm: FormGroup;
  dogList = [];
  // @ViewChild('dogPicker', { static: false }) dogPicker: DogPickerComponent;


  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private dogsService: DogsService
  ) { 
    this.today = new Date();// .toString();
    this.dogs = this.dogsService.getDogs();    
  }

  ngOnInit() {
    this.reminderForm = new FormGroup({
      title: new FormControl('', { updateOn: 'blur' }),
      date: new FormControl(this.today.toISOString(), { updateOn: 'blur', validators: [Validators.required] }),
      dogsList: new FormArray([])
    });

    this.dogs.subscribe(data => {
      data.forEach((d: Dog) => {
        let checkedBool = false;
        if (this.dog && this.dog.id == d.id){ checkedBool = true; }
        this.dogList.push({ id: d.id, name: d.name, checked: checkedBool, cssColor: d.cssColor })
      })
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onAddReminder() {
    this.modalCtrl.dismiss(this.reminderForm, 'addReminder');
    /* let name = (this.dog) ? this.dog.name : form.value.dog.name;
    const toast = await this.toastCtrl.create({
      message: 'New weight record added for ' + name,
      duration: 2500,
      cssClass: 'ion-text-center'
    });
    toast.present(); */
  }

/*   updateCheckControl(cal, o) {
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
  } */

   onSelectionChange(e, i) {
    //const checkboxArrayList: FormArray = this.form.get('sportsList') as FormArray;
    this.dogList[i].checked = e.target.checked;
    //this.updateCheckControl(checkboxArrayList, e.target);
  }

}
