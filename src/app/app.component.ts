import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig,private layoutService: LayoutService) { }

    ngOnInit() {
        this.primengConfig.ripple = false;
        this.layoutService.config = {
            ripple: false,                      //toggles ripple on and off
            inputStyle: 'outlined',             //default style for input elements
            menuMode: 'static',                 //layout mode of the menu, valid values are "static" and "overlay"
            colorScheme: 'dark',               //color scheme of the template, valid values are "light" and "dark"
            theme: 'bootstrap4-dark-blue',         //default component theme for PrimeNG
            scale: 13                          //size of the body font size to scale the whole application
        };
    }
}
