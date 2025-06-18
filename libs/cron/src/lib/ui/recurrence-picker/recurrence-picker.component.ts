import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { describeCron } from '@angular-monorepo/cron';

@Component({
  selector: 'app-recurrence-picker',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recurrence-picker.component.html',
  styleUrls: ['./recurrence-picker.component.css'],
    standalone: true
})
export class RecurrencePickerComponent implements OnInit {
  recurrenceForm!: FormGroup
  repeatTypes = ['Daily', 'Weekly', 'Monthly']
  weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  fullWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthlyWeekOrder = ['First', 'Second', 'Third', 'Fourth', 'Last']
  description: string = ''

  selectedWeekdays: boolean[] = Array(7).fill(false)

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.recurrenceForm = this.fb.group({
  startDate: ['', Validators.required],
  repeat: ['Daily', Validators.required],
  every: [1, [Validators.required, Validators.min(1)]],
  endDate: [''],
  weekdays: [[]],
  monthDay: [1],
  monthWeek: ['First'],
  monthWeekday: ['Monday'],
  monthMode: ['day']
})

    this.recurrenceForm.valueChanges.subscribe(() => {
      this.generateDescription();
    });
  }

  toggleWeekday(index: number) {
    this.selectedWeekdays[index] = !this.selectedWeekdays[index]
    const selected = this.fullWeekdays.filter((_, i) => this.selectedWeekdays[i])
      console.log(selected)
    this.recurrenceForm.get('weekdays')?.setValue(selected)
  }

generateDescription() {
  const val = this.recurrenceForm.value;
  const cron = this.buildCronFromRecurrenceForm(val)

  const startDate = val.startDate || undefined
  const endDate = val.endDate || undefined
  console.log(endDate)
  this.description = describeCron(cron, startDate, endDate)
}

buildCronFromRecurrenceForm(val: any) {
   console.log(val)
  let seconds = '0'
  let minutes = '0'
  let hours = '12'

  let day = '*'
  let month = '*'
  let dayOfWeek = '*'

  if (val.repeat === 'Weekly' && val.weekdays.length > 0) {
    const weekdayMap: any = {
      Sunday: '0',
      Monday: '1',
      Tuesday: '2',
      Wednesday: '3',
      Thursday: '4',
      Friday: '5',
      Saturday: '6'
    };
    dayOfWeek = val.weekdays.map((day: string) => weekdayMap[day]).join(',')
  }

  if (val.repeat === 'Monthly') {
    if (val.monthDay) {
      day = `${val.monthDay}`
    } else {
      day = '?'
    }
  }

  return `${seconds} ${minutes} ${hours} ${day} ${month} ${dayOfWeek}`
}



  resetForm() {
    this.recurrenceForm.reset({
      repeat: 'Daily',
      every: 1
    });
    this.selectedWeekdays = Array(7).fill(false);
    this.description = '';
  }

  save() {
    console.log('Saved recurrence:', this.recurrenceForm.value);
  }
}
