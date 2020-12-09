import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Output() imagePick = new EventEmitter<string>();
  selectedImage = '../../assets/img/generic-photo.png';
  dogColor: string;

  constructor() { }

  ngOnInit() {}

  onPickImage(){
    if (!Capacitor.isPluginAvailable('Camera')){
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      // source: CameraSource.Prompt,
      source: CameraSource.Photos,
      correctOrientation: true,
      height: 500,
      width: 500,
      preserveAspectRatio: true,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    }).then(
      image => {
        console.log(image.format);
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      }
    ).catch(
      error => { console.log(error); return false; }
    );
  }

}
