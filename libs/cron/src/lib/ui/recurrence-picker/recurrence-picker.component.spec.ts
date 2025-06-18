import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecurrencePickerComponent } from './recurrence-picker.component';

describe('UiComponent', () => {
  let component: RecurrencePickerComponent;
  let fixture: ComponentFixture<RecurrencePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrencePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrencePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
