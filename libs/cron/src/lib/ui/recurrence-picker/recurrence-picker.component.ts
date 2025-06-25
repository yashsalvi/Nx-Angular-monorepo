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
exportedCron: string = ''
  selectedWeekdays: boolean[] = Array(7).fill(false)

  constructor(private fb: FormBuilder) {}

ngOnInit(): void {
  this.recurrenceForm = this.fb.group({
    startDate: ['', Validators.required],
    repeat: ['Daily', Validators.required],
    every: [1, [Validators.required, Validators.min(1)]],
    endDate: [''],
    weekdays: [[]],
    monthDay: [{ value: 1, disabled: false }],
    monthWeek: [{ value: 'First', disabled: true }],
    monthWeekday: [{ value: '', disabled: true }],
    monthMode: ['day']
  });

  this.recurrenceForm.get('monthMode')?.valueChanges.subscribe(mode => {
    if (mode === 'day') {
      this.recurrenceForm.get('monthDay')?.enable();
      this.recurrenceForm.get('monthWeek')?.disable();
      this.recurrenceForm.get('monthWeekday')?.disable();
    } else {
      this.recurrenceForm.get('monthDay')?.disable();
      this.recurrenceForm.get('monthWeek')?.enable();
      this.recurrenceForm.get('monthWeekday')?.enable();
    }
  });
   console.log(this.recurrenceForm)

    this.recurrenceForm.get('repeat')?.valueChanges.subscribe(repeatType => {
    const today = new Date()
    const dayIndex = today.getDay()
    const weekdayName = this.fullWeekdays[dayIndex]

    if (repeatType === 'Weekly') {
      this.selectedWeekdays = Array(7).fill(false)
      this.selectedWeekdays[dayIndex] = true
      this.recurrenceForm.get('weekdays')?.setValue([weekdayName])
    }

    if (repeatType === 'Monthly') {
  this.recurrenceForm.patchValue({
    monthWeek: 'First',
    monthWeekday: weekdayName
  })
    }
    console.log(this.selectedWeekdays)
  });

  this.recurrenceForm.valueChanges.subscribe((val) => {
    this.generateDescription();

    const start = new Date(val.startDate);
    const end = new Date(val.endDate);

    if (val.endDate && start > end) {
      this.recurrenceForm.get('endDate')?.setErrors({ logicalError: 'End date cannot be before start date.' });
    } else {
      this.recurrenceForm.get('endDate')?.setErrors(null);
    }

    if (val.repeat === 'Weekly' && (!val.weekdays || val.weekdays.length === 0)) {
      this.recurrenceForm.get('weekdays')?.setErrors({ logicalError: 'Select at least one weekday.' });
    } else {
      this.recurrenceForm.get('weekdays')?.setErrors(null);
    }
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
 console.log('Generated CRON:', cron);
  const startDate = val.startDate || undefined
  const endDate = val.endDate || undefined
  console.log(endDate)
  this.description = describeCron(cron, startDate, endDate, { mode: 'human' })
}

buildCronFromRecurrenceForm(val: any) {
  let seconds = '0';
  let minutes = '0';
  let hours = '12';

  let day = '*';
  let month = '*';
  let dayOfWeek = '*';

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
    dayOfWeek = val.weekdays.map((day: string) => weekdayMap[day]).join(',');
  }

  if (val.repeat === 'Monthly') {
    if (val.monthMode === 'day' && val.monthDay) {
      day = `${val.monthDay}`;
      dayOfWeek = '*';
    } else if (val.monthMode === 'week' && val.monthWeek && val.monthWeekday) {
      const weekdayMap: any = {
        Sunday: '0',
        Monday: '1',
        Tuesday: '2',
        Wednesday: '3',
        Thursday: '4',
        Friday: '5',
        Saturday: '6'
      };
      debugger
      const orderMap: any = {
        First: '1',
        Second: '2',
        Third: '3',
        Fourth: '4',
        Last: '5'
      };

      day = '?';
      dayOfWeek = `${weekdayMap[val.monthWeekday]}#${orderMap[val.monthWeek]}`;
    }
  }

  return `${seconds} ${minutes} ${hours} ${day} ${month} ${dayOfWeek}`;
}



  resetForm() {
    this.recurrenceForm.reset({
      repeat: 'Daily',
      every: 1
    });
    this.selectedWeekdays = Array(7).fill(false);
    this.description = '';
  }

  exportCron() {
  const val = this.recurrenceForm.value;
  const cron = this.buildCronFromRecurrenceForm(val);
  this.exportedCron = cron;

  navigator.clipboard.writeText(cron).then(() => {
    console.log('Cron copied to clipboard:', cron);
  });
}

  save() {
    console.log('Saved recurrence:', this.recurrenceForm.value);
  }
}
