import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeightsPage } from './weights.page';

describe('WeightsPage', () => {
  let component: WeightsPage;
  let fixture: ComponentFixture<WeightsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
