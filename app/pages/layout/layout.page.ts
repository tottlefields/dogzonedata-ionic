import { Component, OnInit } from '@angular/core';

import { DogsService } from 'src/app/services/dogs.service';
import { SplitPaneService } from 'src/app/services/split-pane.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  public dogs: any;

  constructor(
    private dogsService: DogsService,
    public spService: SplitPaneService,
    ) { }

  ngOnInit() {
    this.dogs = this.dogsService.getDogs();
  } 
  
  validatePaw(color: string){
    if (color == '#000000'){
      return '../../assets/img/generic-paw-black.png';
    }
    return '../../assets/img/generic-paw.png';
  }

}
