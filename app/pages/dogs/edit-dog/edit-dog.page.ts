import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DogsService } from 'src/app/services/dogs.service';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-dog',
  templateUrl: './edit-dog.page.html',
  styleUrls: ['./edit-dog.page.scss'],
})
export class EditDogPage implements OnInit, OnDestroy {

  //dog: Dog;
  // form: NgForm;
  form: FormGroup;
  dog: any;
  @ViewChild('imgPicker') imgPicker: ImagePickerComponent;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dogsService: DogsService
   ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/dzd/dogs/']);
        return;
      }

      this.form = new FormGroup({
        kc_name: new FormControl(null, {
          updateOn: 'blur'
        }),
        name: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        sex: new FormControl(null, {
          updateOn: 'blur'
        }),
        image: new FormControl(null)
      });

      // this.dog = this.dogsService.getDog(paramMap.get('dogId')).valueChanges();
      this.dogsService.getIdea(paramMap.get('dogId')).subscribe(dog => {
        this.dog = dog;
        if (dog.imageUrl) { 
          this.imgPicker.selectedImage = dog.imageUrl;
          this.form.patchValue({ image: dog.imageUrl });
        }
        if (dog.color) { this.imgPicker.dogColor = dog.color; }
        console.log(this.dog);
        this.form.patchValue({name : dog.name});
        this.form.get('sex').setValue(dog.sex);
        // this.form.setValue({sex : dog.sex});
      });

      console.log(this.form.value);
    });
  }

  ngOnDestroy(): void { }

  onImagePicked(imageData: string | File){
    let imageFile;
    if (typeof imageData === 'string'){
      try {
        // console.log(imageData);
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      }
      catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  updateDog() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
  }
}
