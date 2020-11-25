import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DzdPage } from './dzd.page';

describe('DzdPage', () => {
  let component: DzdPage;
  let fixture: ComponentFixture<DzdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DzdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DzdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
