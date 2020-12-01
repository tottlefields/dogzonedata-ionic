import { ImagePickerComponent } from './../../../shared/pickers/image-picker/image-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Component, OnInit, Input, ViewChild, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.scss'],
})
export class AddDogComponent implements OnInit {
  dogColor = '#000000';
  form: NgForm;
  @ViewChild('imgPicker', { static: false }) imgPicker: ImagePickerComponent;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onAddDog(form: NgForm) {
    this.modalCtrl.dismiss(form, 'addDog');
  }

  changeDogColor(event) {
    this.dogColor = event.detail.value;
    this.imgPicker.dogColor = this.dogColor;
  }

  onImagePicked(imageData: string){
    
  }
}
