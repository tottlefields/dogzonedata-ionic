import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-dog-menu',
  templateUrl: './dog-menu.component.html',
  styleUrls: ['./dog-menu.component.scss'],
})
export class DogMenuComponent implements OnInit {

  dogs: any;

  constructor(
    private dogsService: DogsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  updateDogList() {
    this.dogs = this.dogsService.getDogs();
    console.log('here I updating...');
    console.log(this.dogs);
  }

}
