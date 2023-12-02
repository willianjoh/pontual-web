import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteList } from './../../models/cliente.interface';
import { ClienteService } from './../../services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { OrdemServicoService } from 'src/app/services/ordemServico.service';
import { OrdemServico } from 'src/app/models/ordemServico.interface';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    templateUrl: './ordemServicoCadastro.component.html',
    providers: [MessageService]
})
export class OrdemServicoProdutosComponent implements OnInit {

    formGroup!: FormGroup;

    ordemServicoDialog: boolean = false;

    deleteOrdemServicoDialog: boolean = false;

    deleteOrdemServicosDialog: boolean = false;

    ordemServicos: Product[] = [];

    ordemServico: OrdemServico = {};

    selectedOrdemServicos: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statusServico: any[] = [];

    statusPagamento: any[] = [];

    formaPagamento: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] = [];

    parcelas: any[] = [];

    clientes: ClienteList[] = [];

    filteredClientes: ClienteList[] = [];

    home!: MenuItem;

    isNew: boolean = false;

    titulo: string = 'Novo Cliente';
    showSpinner = false

    @BlockUI() blockUI!: NgBlockUI;

    constructor(private productService: ProductService,
        private ordemSerivicoService: OrdemServicoService,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) {
        this.statusServico = [
            { code: "1", label: 'EM ANDAMENTO', value: 'emAndamento' },
            { code: "2", label: 'DISPONÍVEL PARA RETIRADA', value: 'disponivel' },
            { code: "3", label: 'ENTREGUE', value: 'entregue' }
        ];

        this.statusPagamento = [
            { code: "1", label: 'PAGAMENTO PENDENTE', value: 'pendente' },
            { code: "2", label: 'PAGAMENTO REALIZADO', value: 'realizado' },
        ];

        this.formaPagamento = [
            { code: 1, label: 'Dinheiro' },
            { code: 2, label: 'Débito' },
            { code: 3, label: 'Crédito' },
            { code: 4, label: 'Pix' },
        ];

        this.parcelas = [
            { label: '1x', value: '1' },
            { label: '2x', value: '2' },
            { label: '3x', value: '3' },
            { label: '4x', value: '4' },
            { label: '5x', value: '5' },
            { label: '6x', value: '6' },
            { label: '7x', value: '7' },
            { label: '8x', value: '8' },
            { label: '9x', value: '9' },
            { label: '10x', value: '10' },
            { label: '11x', value: '11' },
            { label: '12x', value: '12' },
        ];
    }

    ngOnInit() {
        this.buildFormGroup()
        this.items = [{ label: 'Ordem de Serviço' }, { label: 'Ordem de Serviço' }, { label: 'Emitir Ordem de Serviço' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
        this.getCLientes();
        this.showSpinner = false
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            tipoServico: ['', Validators.required],
            codigo: ['', Validators.required],
            dataOrcamento: ['', Validators.required],
            dataEntrega: [''],
            cliente: [null, Validators.required],
            valorServico: ['', Validators.required],
            status: ['', Validators.required],
            statusPagamento: ['', Validators.required],
            formaPagamento: ['', Validators.required],
            qtdParcelas: [''],
            valorParcela: [''],
            observacao: ['']
        });
    }

    getCLientes() {
        this.blockUI.start('Carregando...')
        this.clienteService.getAllClientes()
            .pipe(
                catchError(error => {
                    this.blockUI.stop();
                    if (error == 500 || error == 400) {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                    }
                    return of();
                })
            ).subscribe(resp => {
                this.clientes = resp;
                this.clientes?.map(r => {
                    r.nome = r.nome?.concat(" " + r.sobrenome)
                })
                this.blockUI.stop();
            });
    }

    filterClientes(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.clientes as any[]).length; i++) {
            let cliente = (this.clientes as any[])[i];
            if (cliente.nome.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(cliente);
            }
        }

        this.filteredClientes = filtered;
    }

    openNew() {
        this.submitted = false;
        this.ordemServicoDialog = true;
        this.isNew = true;
        this.titulo = "Ordem de serviço"
    }

    deleteSelectedOrdemServicos() {
        this.deleteOrdemServicosDialog = true;
    }

    editOrdemServico(product: Product) {
        this.ordemServicoDialog = true;
        this.titulo = "Editar ordem de serviço"
    }

    deleteOrdemServico(product: Product) {
        this.deleteOrdemServicoDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteOrdemServicosDialog = false;
    }

    confirmDelete() {
        this.deleteOrdemServicosDialog = false;
    }

    hideDialog() {
        this.ordemServicoDialog = false;
        this.submitted = false;
    }

    saveOrdemServico() {
        this.submitted = true;

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}