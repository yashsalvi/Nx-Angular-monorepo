import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductListComponent } from '@angular-monorepo/products';

@Component({
    imports: [ProductListComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    selector: 'angular-monorepo-root',
    templateUrl: './app.component.html',
    standalone: true,
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inventory';
}
