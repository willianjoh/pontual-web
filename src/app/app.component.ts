import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    pt = {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
          'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar',
        dateFormat: 'dd/mm/yy',
    }
    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) { }

    ngOnInit() {
        this.primengConfig.setTranslation(this.pt)
        this.primengConfig.ripple = false;
        this.layoutService.config = {
            ripple: false,                      //toggles ripple on and off
            inputStyle: 'outlined',             //default style for input elements
            menuMode: 'static',                 //layout mode of the menu, valid values are "static" and "overlay"
            colorScheme: 'dark',               //color scheme of the template, valid values are "light" and "dark"
            theme: 'bootstrap4-dark-blue',         //default component theme for PrimeNG
            scale: 12                          //size of the body font size to scale the whole application
        };
    }
}
