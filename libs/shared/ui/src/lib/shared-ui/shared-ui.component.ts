import { Component, Input } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
    standalone: true,
  selector: 'angular-monorepo-shared-ui',
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './shared-ui.component.html',
  styleUrl: './shared-ui.component.css',
})
export class SharedUiComponent {
  @Input() item: any;
  @Input() showImage = false;
  imageWidth = 150;
  imageMargin = 5;
}
