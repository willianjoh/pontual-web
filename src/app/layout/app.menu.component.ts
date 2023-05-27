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
                        label: 'Clientes', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Cadastro de Clientes', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório de clientes', icon: 'pi pi-fw pi-bookmark',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Produtos',
                items: [
                    {
                        label: 'Produtos', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Cadastro de produtos', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório de produtos', icon: 'pi pi-fw pi-bookmark',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Vendas',
                items: [
                    {
                        label: 'Vendas', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Cadastro de vendas', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório de vendas (Diário)', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório de vendas (Mensal)', icon: 'pi pi-fw pi-bookmark',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Ordem de Serviço',
                items: [
                    {
                        label: 'Ordem de Serviço', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Emitir Ordem de Serviço', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório OS (Diário)', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório OS (Mensal)', icon: 'pi pi-fw pi-bookmark',
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Financeiro',
                items: [
                    {
                        label: 'Financeiro', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Fechamento de caixa', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Cadastrar Contas/Despesas', icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Emitir relatório mensal', icon: 'pi pi-fw pi-bookmark',
                            },
                        ]
                    }
                ]
            },
        ];
    }
}
