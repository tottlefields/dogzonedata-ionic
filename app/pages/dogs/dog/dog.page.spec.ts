import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DogPage } from './dog.page';

describe('DogPage', () => {
  let component: DogPage;
  let fixture: ComponentFixture<DogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
