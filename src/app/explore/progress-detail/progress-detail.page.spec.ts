import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgressDetailPage } from './progress-detail.page';

describe('ProgressDetailPage', () => {
  let component: ProgressDetailPage;
  let fixture: ComponentFixture<ProgressDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
