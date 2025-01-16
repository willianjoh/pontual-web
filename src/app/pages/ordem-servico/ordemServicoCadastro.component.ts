import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { OrdemServicoPage } from 'src/app/models/ordemServico.interface';
import { GlobalFilter, Pageable } from 'src/app/models/pageable.interface';
import { OrdemServicoService } from 'src/app/services/ordemServico.service';
import { CommonUtils } from 'src/app/utils/utils';
import * as XLSX from 'xlsx';
import { ClienteList } from './../../models/cliente.interface';
import { OrdemServico } from './../../models/ordemServico.interface';
import { ClienteService } from './../../services/cliente.service';

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

    ordemServicos!: OrdemServicoPage[];

    ordemServico: OrdemServico = {
        cliente: {},
        dataOrcamento: '',
        dataEntrega: ''
    };

    selectedOrdemServicos: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statusServico: any[] = [];

    statusPagamento: any[] = [];

    formaPagamento: any[] = [];

    items: MenuItem[] = [];

    parcelas: any[] = [];

    clientes: ClienteList[] = [];

    filteredClientes: ClienteList[] = [];

    home!: MenuItem;

    habilitaParcelas: boolean = true;

    isNew: boolean = false;

    pageable: Pageable = new Pageable();

    filter: GlobalFilter = new GlobalFilter();

    titulo: string = "Ordem de serviço";

    showSpinner = false

    @BlockUI() blockUI!: NgBlockUI;
    totalRecords: number = 10;

    constructor(
        private ordemServicoService: OrdemServicoService,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) {
        this.statusServico = [
            { label: "PENDENTE", value: "pendente" },
            { label: "CANCELADO", value: "cancelado" },
            { label: "CONCLUIDO", value: "concluido" }
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
        this.buildFormGroup()
        this.items = [{ label: 'Ordem de Serviço' }, { label: 'Emitir Ordem de Serviço' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
        this.pageOrdemServicos(this.pageable, this.filter)
        this.getCLientes();
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            servico: ['', Validators.required],
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
            observacao: [{ value: null }]
        });
    }

    getCLientes() {
        this.blockUI.start('Carregando...')
        this.clienteService.getAllClientes()
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(resp => {
                this.clientes = resp;
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

    selecionaFormaDePagamento(event: any) {
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
        this.ordemServico = {
            cliente: {},
            dataOrcamento: this.formatData(new Date()),
            dataEntrega: ''
        };
        this.ordemServicoDialog = true;
        this.ordemServico.status = "PENDENTE"
        this.ordemServico.statusPagamento = "PENDENTE"
        this.ordemServico.formaPagamento = "Dinheiro"
        this.titulo = "Ordem de serviço"
    }

    deleteSelectedOrdemServicos() {
        this.deleteOrdemServicosDialog = true;
    }

    editOrdemServico(ordemServico: OrdemServico) {
        this.ordemServico = { ...ordemServico };
        this.ordemServicoDialog = true;
        this.titulo = "Editar ordem de serviço"
    }

    deleteOrdemServico(ordemServico: OrdemServico) {
        this.ordemServico = { ...ordemServico };
        this.deleteOrdemServicoDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteOrdemServicosDialog = false;
        const ids = this.selectedOrdemServicos.map(ordemServico => ordemServico.id);
        this.deleteOrdemServicos(ids)
    }

    private deleteOrdemServicos(ids: any) {
        this.blockUI.start('Carregando...');
        this.ordemServicoService.deleteAll(ids)
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordens de Serviços excluídas com sucesso.', life: 4000 });
                this.selectedOrdemServicos = [];
                this.pageOrdemServicos(this.pageable, this.filter);
            });
    }

    confirmDelete() {
        this.deleteOrdemServicoDialog = false;
        if (this.ordemServico?.id) {
            this.deleteOrdemServicoById(this.ordemServico.id);
        }
    }

    private deleteOrdemServicoById(id: number) {
        this.blockUI.start('Carregando...');
        this.ordemServicoService.delete(id)
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de serviço excluída com sucesso.', life: 4000 });
                this.pageOrdemServicos(this.pageable, this.filter);
            });
    }

    private handleError(error: any, message: string) {
        this.blockUI.stop();
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: message, life: 4000 });
        return of();
    }

    hideDialog() {
        this.blockUI.stop();
        this.formGroup.reset()
        this.ordemServicoDialog = false;
        this.submitted = false;
    }

    saveOrdemServico() {
        this.submitted = true;
        if (this.ordemServico.id) {
            this.update()
        } else {
            this.save()
        }
    }

    save() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            if (this.ordemServico.status === 'CANCELADO') {
                this.blockUI.stop();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não é possível incluir uma ordem de serviçio com situação: CANCELADO.',
                    life: 4000
                });
                return;
            }
            const dataOrcamentoFormatada = this.formatData(this.ordemServico.dataOrcamento);
            const dataEntregaFormatada = this.formatData(this.ordemServico.dataEntrega);

            this.ordemServico.dataEntrega = this.ordemServico.dataEntrega
                ? dataEntregaFormatada
                : null;

            this.ordemServico.dataOrcamento = this.ordemServico.dataOrcamento
                ? dataOrcamentoFormatada
                : null;
            if (this.validarDatas(this.ordemServico.dataOrcamento, this.ordemServico.dataEntrega)) {

                this.ordemServicoService.save(this.ordemServico)
                    .pipe(
                        catchError(error => this.handleError(error, error.message))
                    )
                    .subscribe(resp => {
                        if (resp.id != null) {
                            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 4000 });
                        }
                        this.formGroup.reset()
                        this.blockUI.stop();
                        this.hideDialog()
                        this.pageOrdemServicos(this.pageable, this.filter)
                    })
            } else {
                this.blockUI.stop();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'A data de entrega não pode ser anterior à data do orçamento.',
                    life: 4000
                });
            }
        }
    }

    update() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            const dataOrcamentoFormatada = this.formatData(this.ordemServico.dataOrcamento);
            const dataEntregaFormatada = this.formatData(this.ordemServico.dataEntrega);

            this.ordemServico.dataEntrega = this.ordemServico.dataEntrega
                ? dataEntregaFormatada
                : null;

            this.ordemServico.dataOrcamento = this.ordemServico.dataOrcamento
                ? dataOrcamentoFormatada
                : null;

            if (this.validarDatas(this.ordemServico.dataOrcamento, this.ordemServico.dataEntrega)) {
                this.ordemServicoService.update(this.ordemServico)
                    .pipe(
                        catchError(error => this.handleError(error, error.message))
                    )
                    .subscribe(resp => {
                        if (resp.id != null) {
                            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 4000 });
                        }
                        this.hideDialog();
                        this.pageOrdemServicos(this.pageable, this.filter);
                    });
            }
            else {
                this.blockUI.stop();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'A data de entrega não pode ser anterior à data do orçamento.',
                    life: 4000
                });
            }
        }
    }

    private validarDatas(dataOrcamento: string | null, dataEntrega: string | null): boolean {
        if (!dataOrcamento || !dataEntrega) {
            return false;
        }

        try {
            const [diaOrc, mesOrc, anoOrc] = dataOrcamento.split('/').map(Number);
            const dataOrcamentoObj = new Date(anoOrc, mesOrc - 1, diaOrc);

            const [diaEnt, mesEnt, anoEnt] = dataEntrega.split('/').map(Number);
            const dataEntregaObj = new Date(anoEnt, mesEnt - 1, diaEnt);

            return dataEntregaObj >= dataOrcamentoObj;
        } catch (error) {
            return false;
        }
    }


    private formatData(data: string | Date | null): string {
        if (!data) {
            return '';
        }

        try {
            let date: Date;
            if (data instanceof Date) {
                date = data;
            } else if (/\d{2}\/\d{2}\/\d{4}/.test(data)) {
                const [day, month, year] = data.split('/').map(Number);
                date = new Date(year, month - 1, day);
            } else {
                date = new Date(data);
            }

            if (!isNaN(date.getTime())) {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }

            return '';
        } catch (error) {
            return '';
        }
    }


    pageOrdemServicos(pageable: Pageable, filter: GlobalFilter) {
        this.blockUI.start('Carregando...')
        this.ordemServicoService.buscarOrdemServicos(pageable, filter)
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(resp => {
                if (resp != null) {
                    this.ordemServicos = resp.content || [];
                    this.ordemServicos?.map(r => {
                        r.dataEntrega = CommonUtils.formatData(r.dataEntrega)
                        r.dataOrcamento = CommonUtils.formatData(r.dataOrcamento)
                        r.qtdParcelas = String(r.qtdParcelas)
                    })
                    let total = resp.totalElements;
                    this.totalRecords = total;
                }
                this.blockUI.stop();
            })
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    page(event: any) {
        const sortOrder = event.sortOrder === 1 ? "ASC" : event.sortOrder === -1 ? "DESC" : ""
        this.pageable.page = event.first / event.rows;
        this.pageable.size = event.rows;
        this.pageable.sort = event.sortField ? `${event.sortField},${sortOrder}` : "";
        this.filter.filter = event.globalFilter
        this.pageOrdemServicos(this.pageable, this.filter)
    }

    exportExcel() {
        if (this.ordemServicos == undefined || this.ordemServicos.length == 0) {
            this.messageService.add({ severity: 'info', summary: 'Exportação não realizada', detail: "Não há dados disponíveis para exportar.", life: 4000 });
            return
        }

        const worksheetData = this.ordemServicos.map((ordemServico: any) => ({
            'Número OS': ordemServico.codigo,
            'Tipo de Serviço': ordemServico.servico,
            'Nome do Cliente': ordemServico.cliente?.nome,
            'Data do Orçamento': ordemServico.dataOrcamento,
            'Data de Entrega': ordemServico.dataEntrega,
            'Situação do Serviço': ordemServico.status
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordem de Serviços');

        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const today = new Date();
        const formattedDate =
            String(today.getDate()).padStart(2, '0') +
            String(today.getMonth() + 1).padStart(2, '0') +
            today.getFullYear();

        const fileName = `ordem-servicos_${formattedDate}.xlsx`;

        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, fileName);

        this.messageService.add({
            severity: 'success',
            summary: 'Exportação Concluída',
            detail: 'Os dados foram exportados com sucesso para o arquivo Excel.',
            life: 4000
        });
    }

}