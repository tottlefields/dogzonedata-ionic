import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DogDetailPage } from './dog-detail.page';

describe('DogDetailPage', () => {
  let component: DogDetailPage;
  let fixture: ComponentFixture<DogDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DogDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DogDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
