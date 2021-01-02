import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

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
  textColor = '#FFFFFF';
  cssColor = 'dzd-black';
  genericPaw = '../../assets/img/generic-paw.png';
  chipProviders: any;
  sportsVisible = false;
  sportsList: string[];
  Object = Object;
  @ViewChild('imgPicker', { static: false }) imgPicker: ImagePickerComponent;

  CHECK_LIST = [];
  //   { sport: 'Agility', checked: false },
  //   { sport: 'Canicross', checked: false },
  //   { sport: 'Flyball', checked: false },
  //   { sport: 'Obedience', checked: false }
  // ];

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
        this.navCtrl.navigateBack(['/app/dzd/dogs/']);
        return;
      }

      this.dogColors = environment.dogColors;
      this.chipProviders = environment.microchipProviders;
      this.sportsList = environment.dogSports;

      this.sportsList.forEach(s => {
        this.CHECK_LIST.push({ sport : s, checked : false})
      });

      this.form = new FormGroup({
        kcName: new FormControl('', { updateOn: 'blur' }),
        name: new FormControl('', { updateOn: 'blur', validators: [Validators.required] }),
        sex: new FormControl(null, { updateOn: 'blur' }),
        microchipNum: new FormControl(null, { updateOn: 'blur' }),
        chipProvider: new FormControl(null, { updateOn: 'blur' }),
        breed: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
        dateOfBirth: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
        color: new FormControl(null, { updateOn: 'blur', }),
        dob: new FormControl(null),
        imageUrl: new FormControl(null),
        sportsDog: new FormControl(null),
        breedingBitch: new FormControl(null),
        healthTested: new FormControl(null),
        sportsList: new FormArray([])
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
        if (dog.cssColor) {
          this.cssColor = dog.cssColor;
        }
        if (dog.colorText){ 
          this.textColor = dog.colorText;
          this.imgPicker.textColor = dog.colorText;
          if (dog.colorText == '#000000'){
            this.genericPaw = '../../assets/img/generic-paw-black.png';
            if (!dog.imageUrl){ this.imgPicker.selectedImage = '../../assets/img/generic-photo-black.png'; }
          }
        }
        this.form.patchValue({name : dog.name});
        this.form.get('kcName').setValue(dog.kcName);
        this.form.get('sex').setValue(dog.sex);
        this.form.get('breed').setValue(dog.breed);

        if (typeof this.dog.microchip !== 'object' || !this.dog.microchip){
          let chip = (this.dog.microchip) ? this.dog.microchip : '';
          this.dog.microchip = {
            'num' : chip,
            'provider' : '',
          };
          console.log('updating dog with new microchip format...')
          this.dogsService.updateDog(this.dog.id, this.dog);
        }
        this.form.get('microchipNum').setValue(this.dog.microchip.num);
        this.form.get('chipProvider').setValue(this.dog.microchip.provider);
        this.form.get('color').setValue(dog.color);
        this.form.get('dateOfBirth').setValue(dog.dob.toDate().toISOString());

        // this.dog.sportsDog = true;
        // this.dog.healthTested = true;
        // this.dog.breedingBitch = true;
        // this.dog.sportsList = ['Agility', 'Flyball'];

        if (this.dog.sportsDog){
          this.form.get('sportsDog').setValue(this.dog.sportsDog);
          this.sportsVisible = true;
          if (this.dog.sportsList.length > 0){
            this.CHECK_LIST.forEach(o => {
              if (this.dog.sportsList.includes(o.sport)){ o.checked = true; }
            });
          }
        }
        if (this.dog.healthTested){ this.form.get('healthTested').setValue(this.dog.healthTested); }
        if (this.dog.breedingBitch){ this.form.get('breedingBitch').setValue(this.dog.breedingBitch); }

      });
    });
  }

  ngOnDestroy(): void { }

  onLoadCheckboxStatus() {
    // const checkboxArrayList: FormArray = this.form.get('sportsList') as FormArray;
    this.CHECK_LIST.forEach(o => {
      if (this.dog.sportsList.includes(o.sport)){ o.checked = true; }
      // this.updateCheckControl(checkboxArrayList, o);
    })
  }

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
    const checkboxArrayList: FormArray = this.form.get('sportsList') as FormArray;
    this.CHECK_LIST[i].checked = e.target.checked;
    this.updateCheckControl(checkboxArrayList, e.target);
  }

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
    this.textColor = environment.textColors[this.dogColor];
    if (this.textColor == '#000000'){
      this.genericPaw = '../../assets/img/generic-paw-black.png';
      if (!this.dog.imageUrl){ this.imgPicker.selectedImage = '../../assets/img/generic-photo-black.png'; }
    }
    else{
      this.genericPaw = '../../assets/img/generic-paw.png';
      if (!this.dog.imageUrl){ this.imgPicker.selectedImage = '../../assets/img/generic-photo.png'; }
    }
    environment.dogColors.forEach(c => {
      if (c.code == this.dogColor){
        this.cssColor = c.cssColor;
      }
    });
  }

  toggleSportsList(event){
    this.sportsVisible = event.detail.checked;
  }

  updateDog() {
    if (!this.form.valid) { return; }

    this.form.value.dob = new Date(this.form.value.dateOfBirth);
    let dog = this.form.value;
    dog.microchip = {
      'num' : this.form.value.microchipNum,
      'provider' :  this.form.value.chipProvider
    };
    delete dog.microchipNum;
    delete dog.chipProvider;

    dog.sportsList.sort(function (a, b) {
      return a.localeCompare(b); //using String.prototype.localCompare()
    });

    // console.log(dog);
    this.dogsService.updateDog(this.dog.id, dog);
    this.navCtrl.navigateBack(['/app/dzd/dogs/', this.dog.id]);
  }
}
