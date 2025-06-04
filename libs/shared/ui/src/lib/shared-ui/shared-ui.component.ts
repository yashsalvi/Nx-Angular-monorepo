import { Component, Input } from '@angular/core';
import { ConvertToSpacesPipe } from '@angular-monorepo/utils';
import { CommonModule, UpperCasePipe, CurrencyPipe } from '@angular/common';

@Component({
    standalone: true,
  selector: 'angular-monorepo-shared-ui',
  imports: [CommonModule, UpperCasePipe, CurrencyPipe, ConvertToSpacesPipe],
  templateUrl: './shared-ui.component.html',
  styleUrl: './shared-ui.component.css',
})
export class SharedUiComponent {
  @Input() item: any;
  @Input() showImage = false;
  imageWidth = 150;
  imageMargin = 5;
}
