import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.interface';
import { DogsService } from 'src/app/services/dogs.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  type: string;
  // diaryItems: Event[];
  public diaryItems = [];
  public reminders = [];
  public events = [];
  dogLookup = {};
  public dogs: any;

  constructor(
    private dogsService: DogsService,
    private generalService: GeneralService
  ) {
    this.type = 'calendar';
  }

  ngOnInit() {

    this.dogsService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
      for (let dog of this.dogs) {
        if (!this.dogLookup[dog.id]) {
          this.dogLookup[dog.id] = {
            label: this.generalService.capitalizeWords(dog.name),
            color: dog.color,
            cssColor: dog.cssColor,
            isRemoved: dog.isRemoved
          };
        }
      }
      this.dogsService.getEvents().subscribe(
        data => {
          this.diaryItems = data;
          this.events = [];
          this.reminders = [];
          data.forEach(event => {
            if (event.type == 'reminder'){ this.reminders.push(event); }
            else { this.events.push(event); }

            if (event.dogs.length > 0){
              event.colors = [];
              event.chips = [];
              event.dogs.forEach(dogId => {
                if (!this.dogLookup[dogId].isRemoved){
                  event.colors.push(this.dogLookup[dogId].color)
                  event.chips.push({
                    label: this.dogLookup[dogId].label, 
                    letter: this.dogLookup[dogId].label.substring(0,1), 
                    cssColor: this.dogLookup[dogId].cssColor 
                  })
                }
              });
            }
          })
        }
      );
    });
    
    

    // console.log(this.diaryItems);
    // if (event.type == 'reminder'){ this.reminders.push(event); }
    // else { this.events.push(event); }
    // console.log(this.events);
  }

  myHeaderFn(record: Event, recordIndex: number, records: Event[]) {
    if (recordIndex === 0) {
      return record.month;
    }

    if (records[recordIndex - 1].month !== record.month) {
      return record.month;
    }

    return null;
  }

  onShowAddEventModal() {
    console.log('add new event...');
  }

}
