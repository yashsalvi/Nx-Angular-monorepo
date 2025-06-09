import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
    selector: 'angular-monorepo-root',
    templateUrl: './app.component.html',
    standalone: true,
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inventory';
}
