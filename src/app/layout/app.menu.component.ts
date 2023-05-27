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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Clientes',
                items: [
                    {
                        label: 'Clientes', icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Cadastro de Clientes', icon: 'pi pi-fw pi-users',
                            },
                            {
                                label: 'Emitir relatório de clientes', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Produtos',
                items: [
                    {
                        label: 'Produtos', icon: 'pi pi-fw pi-bars',
                        items: [
                            {
                                label: 'Cadastro de produtos', icon: 'pi pi-fw pi-bars',
                            },
                            {
                                label: 'Emitir relatório de produtos', icon: 'pi pi-fw pi-file-pdf',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Vendas',
                items: [
                    {
                        label: 'Vendas', icon: 'pi pi-fw pi-shopping-cart',
                        items: [
                            {
                                label: 'Cadastro de vendas', icon: 'pi pi-fw pi-shopping-cart',
                            },
                            {
                                label: 'Emitir relatório de vendas (Diário)', icon: 'pi pi-fw pi-file-pdf',
                            },
                            {
                                label: 'Emitir relatório de vendas (Mensal)', icon: 'pi pi-fw pi-file-pdf',
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
                                label: 'Emitir Ordem de Serviço', icon: 'pi pi-fw pi-wrench',
                            },
                            {
                                label: 'Emitir relatório OS (Diário)', icon: 'pi pi-fw pi-file-pdf',
                            },
                            {
                                label: 'Emitir relatório OS (Mensal)', icon: 'pi pi-fw pi-file-pdf',
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
                                label: 'Cadastrar Contas/Despesas', icon: 'pi pi-fw pi-dollar',
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
