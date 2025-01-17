import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] }
                ]
            },
            {
                label: 'Clientes',
                items: [
                    {
                        label: 'Clientes', icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Gerenciamento de Clientes', icon: 'pi pi-fw pi-users', routerLink: ['customers'],
                            },
                            {
                                label: 'Emitir relatório de clientes', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Vendas',
                items: [
                    {
                        label: 'Vendas', icon: 'pi pi-fw pi-chart-line',
                        items: [
                            {
                                label: 'Gerenciamento de vendas', icon: 'pi pi-fw pi-chart-line', routerLink: ['sales'],
                            },
                            {
                                label: 'Emitir relatório de vendas', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Ordem de Serviço',
                items: [
                    {
                        label: 'Ordem de Serviço', icon: 'pi pi-fw pi-wrench',
                        items: [
                            {
                                label: 'Emitir ordem de serviço', icon: 'pi pi-fw pi-wrench', routerLink: ['service-order'],
                            },
                            {
                                label: 'Emitir relatório OS', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Financeiro',
                items: [
                    {
                        label: 'Financeiro', icon: 'pi pi-fw pi-dollar',
                        items: [
                            {
                                label: 'Fechamento de caixa', icon: 'pi pi-fw pi-dollar',
                            },
                            {
                                label: 'Cadastrar contas/despesas', icon: 'pi pi-fw pi-dollar',
                            },
                            {
                                label: 'Emitir relatório mensal', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
        ];
    }
}
