import { Component } from '@angular/core';

@Component({
  selector: 'angular-monorepo-already-open',
  standalone: true,
  templateUrl: './already-open.component.html',
  styleUrls: ['./already-open.component.css']
})
export class AlreadyOpenComponent {
  constructor(){
    console.log('AlreadyOpenComponent loaded');
  }
}
