import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatesCardComponent } from './dates-card.component';

describe('DatesCardComponent', () => {
  let component: DatesCardComponent;
  let fixture: ComponentFixture<DatesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatesCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
