import { Component, OnInit, Input, ViewChild, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

import { environment } from 'src/environments/environment';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { GeneralService } from 'src/app/services/general.service';
import { DogsService } from 'src/app/services/dogs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.scss'],
})
export class AddDogComponent implements OnInit {
  dogColor = '#000000';
  form2: NgForm;
  form: FormGroup;
  @ViewChild('imgPicker', { static: false }) imgPicker: ImagePickerComponent;

  dogColors: any;
  chipProviders: any;
  Object = Object;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dogsService: DogsService,
    private authService: AuthService,
    private generalService: GeneralService
    ) {}

  ngOnInit() {
    this.dogColors = environment.dogColors;
    this.chipProviders = environment.microchipProviders;
    this.form = new FormGroup({
      kcName: new FormControl(null, {
        updateOn: 'blur'
      }),
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sex: new FormControl(null, {
        updateOn: 'blur'
      }),
      microchipNum: new FormControl(null, {
        updateOn: 'blur'
      }),
      chipProvider: new FormControl(null, {
        updateOn: 'blur'
      }),
      breed: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateOfBirth: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      color: new FormControl(null, {
        updateOn: 'blur',
      }),
      imageUrl: new FormControl(null)
    });
    this.form.get('color').setValue(this.dogColor);
  }

  onCancel() {
    // console.log(this.form.value.imageUrl);
    if (this.form.value.imageUrl) {
      this.dogsService.removeImage(this.form.value.imageUrl);
    }
    this.modalCtrl.dismiss(null, 'cancel');
  }

  /* onAddDog(form: NgForm) {
    this.modalCtrl.dismiss(form, 'addDog');
  } */

  onAddDog(form: FormGroup) {
    this.modalCtrl.dismiss(form, 'addDog');
  }

  changeDogColor(event) {
    this.dogColor = event.detail.value;
    this.imgPicker.dogColor = this.dogColor;
  }

  onImagePicked(imageData: string | File){
    let imageFile;
    if (typeof imageData === 'string'){
      try {
        imageFile = this.generalService.base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      }
      catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }

    const loading = this.loadingCtrl.create({
        message: 'Uploading Image...'
      }).then(loadingEl => {
        loadingEl.present();
        let task = this.dogsService.uploadImage(imageFile, this.authService.getUserId());
        task.then(async res => {
          res.ref.getDownloadURL().then(
            url => {
              /*if (this.dog.imageUrl) {
                // remove old image from storage...
                this.dogsService.removeImage(this.dog.imageUrl);
              }
              this.dog.imageUrl = url; */
              console.log(url);
              this.form.patchValue({ imageUrl: url });
            }
          );
        }).then(
          () => { loadingEl.dismiss(); },
          error => { loadingEl.dismiss(); console.error(error); }
        );
      });

  }
}
