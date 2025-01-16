import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService) { }


    ngOnInit() {
        this.items = [
            {
                label: 'Minha conta',
                icon: 'pi pi-fw pi-user',
            },
            {
                label: 'Usuários',
                icon: 'pi pi-fw pi-users',
                items:[
                    {
                       label:'Cadastrar',
                       icon:'pi pi-fw pi-user-plus'
                    },
                    {
                        label:'Remover',
                        icon:'pi pi-fw pi-user-minus'
                    },
                    {
                        label:'Editar Permissões',
                        icon:'pi pi-fw pi-user-edit'
                    }
                 ]
                 
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
            },
            {
                separator: true
            },
            {
                label: 'Sair',
                icon: 'pi pi-fw pi-power-off',
                routerLink: ['/login']
            }
        ];
    }
}
