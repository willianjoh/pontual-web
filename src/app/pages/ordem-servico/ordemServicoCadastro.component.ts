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
import { ServicoService } from 'src/app/services/servico.service';
import { ServicoCadastroModule } from '../servicos/servicoCadastro.module';
import { ServicoList } from 'src/app/models/servico.interface';

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

    servicos: ServicoList[] = []

    filteredservicos: ServicoList[] = []

    home!: MenuItem;

    habilitaParcelas: boolean = true;

    isNew: boolean = false;

    titulo: string = 'Novo Cliente';
    showSpinner = false

    @BlockUI() blockUI!: NgBlockUI;

    constructor(private productService: ProductService,
        private ordemSerivicoService: OrdemServicoService,
        private clienteService: ClienteService,
        private servicoService: ServicoService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) {
        this.statusServico = [
            { label: "INICIADO", value: "iniciado" },
            { label: "PENDENTE", value: "pendente" },
            { label: "CANCELADO", value: "cancelado" },
            { label: "FINALIZADO", value: "finalizado" }
        ];

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
        this.getServicos();
        this.ordemServico.statusServico = "INICIADO"
        this.ordemServico.statusPagamento = "PENDENTE"
        this.ordemServico.formaPagamento = "Dinheiro"
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
            formaPagamento: [, Validators.required],
            qtdParcelas: [{ value: '', disabled: true }],
            valorParcela: [{ value: '', disabled: true }],
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

    getServicos() {
        this.blockUI.start('Carregando...')
        this.servicoService.getAllServicos()
            .pipe(
                catchError(error => {
                    this.blockUI.stop();
                    if (error == 500 || error == 400) {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                    }
                    return of();
                })
            ).subscribe(resp => {
                this.servicos = resp;
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

    filterServicos(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.servicos as any[]).length; i++) {
            let servico = (this.servicos as any[])[i];
            if (servico.tipo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(servico);
            }
        }

        this.filteredservicos = filtered;
    }

    selecionaFormaDePagamento(event: any) {
        console.log(event.value)
        if (event.value === "Crédito") {
            this.formGroup.get('qtdParcelas')?.setValidators(Validators.required)
            this.formGroup.get('valorParcela')?.setValidators(Validators.required)
            this.formGroup.get('qtdParcelas')?.enable()
            this.formGroup.get('valorParcela')?.enable()

        } else {
            this.formGroup.get('qtdParcelas')?.clearValidators()
            this.formGroup.get('valorParcela')?.clearValidators()
            this.formGroup.get('qtdParcelas')?.reset()
            this.formGroup.get('valorParcela')?.reset()
            this.formGroup.get('qtdParcelas')?.disable()
            this.formGroup.get('valorParcela')?.disable()
        }

    }

    calculaValorParcelasPorValor(event: any) {
        console.log(event)
        let formaPagamento = this.formGroup.get('formaPagamento')?.value;
        let qtdParcelas = Number(this.formGroup.get('qtdParcelas')?.value);
        let valor = Number(event)
        if (formaPagamento === "Crédito" && qtdParcelas && valor) {
            if (valor != undefined && valor != null) {
                this.formGroup.get('valorParcela')?.setValue(valor / qtdParcelas);
            }
        }
    }

    calculaValorParcelas(event: any) {
        let valor = Number(this.formGroup.get('valorServico')?.value);
        let formaPagamento = this.formGroup.get('formaPagamento')?.value;
        if (formaPagamento === "Crédito" && event.value != null && valor) {
            this.formGroup.get('valorParcela')?.setValue(valor / event.value);
        }
    }

    openNew() {
        this.submitted = false;
        this.ordemServicoDialog = true;
        this.isNew = true;
        this.ordemServico.statusServico = "INICIADO"
        this.ordemServico.statusPagamento = "PENDENTE"
        this.ordemServico.formaPagamento = "Dinheiro"
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
        this.formGroup.reset()
    }

    saveOrdemServico() {
        this.submitted = true;
        console.log(this.formGroup.value)
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}