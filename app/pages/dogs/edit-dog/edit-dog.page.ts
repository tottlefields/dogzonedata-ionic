import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-edit-dog',
  templateUrl: './edit-dog.page.html',
  styleUrls: ['./edit-dog.page.scss'],
})
export class EditDogPage implements OnInit, OnDestroy {

  form: FormGroup;
  dog: any;
  dogColors: any;
  dogColor = '#000000';
  @ViewChild('imgPicker', { static: false }) imgPicker: ImagePickerComponent;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dogsService: DogsService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private generalService: GeneralService
   ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/app/dogs/']);
        return;
      }

      this.dogColors = environment.dogColors;

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
        microchip: new FormControl(null, {
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
        dob: new FormControl(null),
        imageUrl: new FormControl(null)
      });

      this.dogsService.getDog(paramMap.get('dogId')).subscribe(dog => {
        this.dog = dog;
        if (dog.imageUrl) {
          this.imgPicker.selectedImage = dog.imageUrl;
          this.form.get('imageUrl').setValue(dog.imageUrl);
        }
        if (dog.color) {
          this.imgPicker.dogColor = dog.color;
          this.dogColor = dog.color;
        }
        this.form.patchValue({name : dog.name});
        this.form.get('kcName').setValue(dog.kcName);
        this.form.get('sex').setValue(dog.sex);
        this.form.get('breed').setValue(dog.breed);
        this.form.get('microchip').setValue(dog.microchip);
        this.form.get('color').setValue(dog.color);
        this.form.get('dateOfBirth').setValue(dog.dob.toDate().toISOString());
      });
    });
  }

  ngOnDestroy(): void { }

  async onImagePicked(imageData: string | File){
    let imageFile;
    if (typeof imageData === 'string'){
      try {
        // console.log(imageData);
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
              if (this.dog.imageUrl) {
                // remove old image from storage...
                this.dogsService.removeImage(this.dog.imageUrl);
              }
              this.dog.imageUrl = url;
              this.form.patchValue({ imageUrl: url });
            }
          );
        }).then(
          () => { loadingEl.dismiss(); },
          error => { loadingEl.dismiss(); console.error(error); }
        );
      });
  }

  changeDogColor(event) {
    this.dogColor = event.detail.value;
    this.imgPicker.dogColor = this.dogColor;
  }

  updateDog() {
    if (!this.form.valid) {
      return;
    }

    if (this.dog.color !== this.form.value.color){
      // console.log('dog colour changed... need to update the weights documents...');
      this.dogsService.updateWeightsColor(this.dog.id, this.form.value.color);
    }

    this.form.value.dob = new Date(this.form.value.dateOfBirth);
    this.dogsService.updateDog(this.dog.id, this.form.value);
    this.navCtrl.navigateBack(['/app/dogs/', this.dog.id]);
  }
}
