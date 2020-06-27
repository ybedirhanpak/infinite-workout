import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateProgressPage } from './create-progress.page';

describe('CreateProgressPage', () => {
  let component: CreateProgressPage;
  let fixture: ComponentFixture<CreateProgressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProgressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
