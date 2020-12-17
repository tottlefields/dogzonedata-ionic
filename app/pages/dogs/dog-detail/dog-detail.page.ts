import { Dog } from 'src/app/models/dog.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.page.html',
  styleUrls: ['./dog-detail.page.scss'],
})
export class DogDetailPage implements OnInit {

  public dog;
  microchip: string;

  constructor( ) {}

  ngOnInit() {
  }
}
