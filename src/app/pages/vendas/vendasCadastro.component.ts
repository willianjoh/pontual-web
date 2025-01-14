import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GlobalFilter, Pageable } from 'src/app/models/pageable.interface';
import { VendaService } from 'src/app/services/venda.service';
import { Venda } from './../../models/venda.interface';

@Component({
    styleUrls: ['./vendasCadastro.component.scss'],
    templateUrl: './vendasCadastro.component.html',
    providers: [MessageService]
})
export class CadastroVendasComponent implements OnInit {

    formGroup!: FormGroup;

    vendaDialog: boolean = false;

    deleteVendaDialog: boolean = false;

    deleteVendasDialog: boolean = false;

    vendas!: Venda[];

    venda: Venda = {
        data: '',
    };


    selectedVendas: Venda[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statusVenda: any[] = [];

    statusPagamento: any[] = [];

    formaPagamento: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] = [];

    parcelas: any[] = [];

    home!: MenuItem;

    habilitaParcelas: boolean = true;

    isNew: boolean = false;

    pageable: Pageable = new Pageable();

    filter: GlobalFilter = new GlobalFilter();

    titulo: string = "Vendas";

    showSpinner = false

    @BlockUI() blockUI!: NgBlockUI;
    totalRecords: number = 10;

    constructor(
        private vendaService: VendaService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) {

        this.statusPagamento = [
            { label: "PENDENTE", value: "pendente" },
            { label: "PAGO", value: "pago" },
        ];

        this.formaPagamento = [
            { code: 1, label: 'Dinheiro' },
            { code: 2, label: 'Débito' },
            { code: 3, label: 'Crédito' },
            { code: 4, label: 'Pix' },
        ];

        this.parcelas = [
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
            { value: '5' },
            { value: '6' },
            { value: '7' },
            { value: '8' },
            { value: '9' },
            { value: '10' },
            { value: '11' },
            { value: '12' },
        ];
    }

    ngOnInit() {
        this.items = [{ label: 'Vendas' }, { label: 'Vendas' }, { label: 'Cadastro de Vendas' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            descricao: ['', Validators.required],
            data: ['', Validators.required],
            valor: ['', Validators.required],
            statusPagamento: ['', Validators.required],
            formaPagamento: [, Validators.required],
            qtdParcelas: [{ value: '', disabled: true }],
            valorParcela: [{ value: '', disabled: true }],
            observacao: [{ value: null }]
        });
    }
    openNew() {
        this.venda = {
            data: '',
        };
        this.submitted = false;
        this.vendaDialog = true;
        this.isNew = true;
        this.titulo = "Venda/Serviço"
    }

    deleteSelectedVendas() {
        this.deleteVendasDialog = true;
    }

    editVenda(product: Venda) {
        this.venda = { ...product };
        this.vendaDialog = true;
        this.titulo = "Editar Venda/Serviço"
    }

    deleteVenda(venda: Venda) {
        this.deleteVendaDialog = true;
        this.venda = { ...venda };
    }

    confirmDeleteSelected() {
        this.deleteVendasDialog = false;

    }

    confirmDelete() {
        this.deleteVendaDialog = false;
    }

    hideDialog() {
        this.vendaDialog = false;
        this.submitted = false;
    }

    saveVenda() {
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}