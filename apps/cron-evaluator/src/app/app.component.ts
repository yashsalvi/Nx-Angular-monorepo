import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecurrencePickerComponent, describeCron } from '@angular-monorepo/cron';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule,CommonModule,ReactiveFormsModule,FormsModule, RecurrencePickerComponent],
  selector: 'app-root',
  standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cronForm!: FormGroup
  templateLabel = ''
savedTemplates: { templateLabel: string; cron: string }[] = []
cronDescription = ''
  cronFieldRanges = {
    seconds: [0, 59],
    minutes: [0, 59],
    hours: [0, 23],
    days: [1, 31],
    month: [1, 12],
    dayOfWeek: [0, 6],
  }

  affected: Record<string, { active: boolean; invalid: boolean }> = this.createEmptyAffected()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.cronForm = this.fb.group({
      cron: ['', [Validators.required, this.validateCronFormat.bind(this)]],
      templateLabel: ['']

    });
      this.loadTemplatesFromStorage();
    console.log( this.cronForm)
    this.cronForm.get('cron')?.valueChanges.subscribe(() => this.evaluateExpression());
  }

saveTemplate() {
  const cron = this.cronForm.get('cron')?.value?.trim();
  const label = this.cronForm.get('templateLabel')?.value?.trim();

  if (!cron) return;

  const templateLabel = label || `Template ${this.savedTemplates.length + 1}`;

  this.savedTemplates.push({ templateLabel, cron });
  localStorage.setItem('cronTemplates', JSON.stringify(this.savedTemplates));

  this.cronForm.reset();
}


loadTemplatesFromStorage() {
  const stored = localStorage.getItem('cronTemplates');
  if (stored) {
    this.savedTemplates = JSON.parse(stored);
  }
}

loadTemplate(event: Event) {
  const target = event.target as HTMLSelectElement;
  const cron = target.value;

  const template = this.savedTemplates.find(t => t.cron === cron);

  if (template) {
    this.cronForm.setValue({cron: template.cron, templateLabel: template.templateLabel});

    this.templateLabel = template.templateLabel;
    this.evaluateExpression();
  }
}


exportTemplates() {
  const blob = new Blob([JSON.stringify(this.savedTemplates, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cron-templates.json';
  a.click();
  URL.revokeObjectURL(url);
}

importTemplates(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      if (Array.isArray(data)) {
        const existingCrons = new Set(this.savedTemplates.map(t => `${t.templateLabel}|${t.cron}`));

        const newTemplates = data.filter(t => {
          const key = `${t.templateLabel}|${t.cron}`;
          return !existingCrons.has(key);
        });

        this.savedTemplates = [...this.savedTemplates, ...newTemplates];
        localStorage.setItem('cronTemplates', JSON.stringify(this.savedTemplates));
      }
    } catch (e) {
      console.error('Invalid template file');
    }
  };
  reader.readAsText(file);
}

  createEmptyAffected() {
    return {
      seconds: { active: false, invalid: false },
      minutes: { active: false, invalid: false },
      hours: { active: false, invalid: false },
      days: { active: false, invalid: false },
      month: { active: false, invalid: false },
      dayOfWeek: { active: false, invalid: false },
    };
  }

  validateCronFormat(control: AbstractControl): ValidationErrors | null {
        console.log( control)
    const value = control.value || ''
    const fields = value.trim().split(/\s+/)
    return fields.length === 6 ? null : { invalidCron: true }
  }

  evaluateExpression() {
    const cron = this.cronForm.get('cron')?.value?.trim();
    this.affected = this.createEmptyAffected()
    this.cronDescription = '';
    console.log( this.affected)
    if (!cron || this.cronForm.invalid) return;

  const fields = cron.split(/\s+/);
  if (fields.length !== 6) return;

  const [sec, min, hr, day, mon, dow] = fields;

    const keys = ['seconds', 'minutes', 'hours', 'days', 'month', 'dayOfWeek'];
    const values = [sec, min, hr, day, mon, dow];
    console.log(values)
    values.forEach((val, i) => {
      const key = keys[i];
      if (val !== '*') {
        this.affected[key].active = true;

        const range = this.cronFieldRanges[key as keyof typeof this.cronFieldRanges];
        const numbers = val
          .split(/[,\/\-]/)
          .map((n: string) => parseInt(n))
          .filter((n: number) => !isNaN(n));
   console.log(numbers)
        this.affected[key].invalid = numbers.some((num: number) => num < range[0] || num > range[1]);
      }
    });
    this.cronDescription = describeCron(cron);
  }

  getClass(field: string) {
    if (this.affected[field].invalid) return 'invalid';
    if (this.affected[field].active) return 'active';
    return '';
  }

  generateRandomCron() {
  const getRandom = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomField = (min: number, max: number, wildcardChance = 0.3) => {
    if (Math.random() < wildcardChance) return '*';
    return `${getRandom(min, max)}`;
  };

  const cron = [
    randomField(0, 59),  
    randomField(0, 59),  
    randomField(0, 23),  
    randomField(1, 31), 
    randomField(1, 12), 
    randomField(0, 6)
  ].join(' ');

  this.cronForm.get('cron')?.setValue(cron);
}

//  generateDescription(fields: string[]): string {
//     const [sec, min, hr, day, month, dow] = fields;

//     const parts: string[] = [];

//     if (sec !== '0' && sec !== '*') parts.push(`at second ${sec}`);
//     if (min !== '0' && min !== '*') parts.push(`at minute ${min}`);

//     if (hr.includes('/')) {
//       const [start, step] = hr.split('/');
//       parts.push(`every ${step} hours starting from hour ${start}`);
//     } else if (hr !== '0' && hr !== '*') {
//       parts.push(`at hour ${hr}`);
//     }

//     if (day !== '*' && day !== '?') parts.push(`on day ${day} of the month`);
//     if (month !== '*' && month !== '?') parts.push(`in month ${month}`);
//     if (dow !== '*' && dow !== '?') parts.push(`on day ${dow} of the week`);

//     return parts.length ? '' + parts.join(', ') + '.' : '';
//   }

  get isCronInvalid() {
    const control = this.cronForm.get('cron');
    console.log(control)
    return !!(control && control.touched && control.errors?.['invalidCron']);
  }

  resetForm() {
    this.cronForm.reset();
    this.affected = this.createEmptyAffected();
    this.cronDescription = ''
  }
}
