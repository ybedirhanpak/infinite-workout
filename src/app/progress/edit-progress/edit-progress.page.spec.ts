import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProgressPage } from './edit-progress.page';

describe('EditProgressPage', () => {
  let component: EditProgressPage;
  let fixture: ComponentFixture<EditProgressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProgressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
