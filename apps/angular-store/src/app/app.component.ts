import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from '@angular-monorepo/orders';

@Component({
    imports: [RouterModule, OrderListComponent],
     schemas: [CUSTOM_ELEMENTS_SCHEMA],
    selector: 'angular-monorepo-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-store';
}
