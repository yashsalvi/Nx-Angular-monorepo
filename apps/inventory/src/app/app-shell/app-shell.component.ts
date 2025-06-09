import { ProductListComponent } from '@angular-monorepo/products';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [ProductListComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent { 
    constructor(){
        console.log('AppShellComponent: Loaded');
    }
}
