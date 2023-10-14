import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { format } from 'path';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { GlobalFilter, Page, Pageable } from 'src/app/models/pageable.interface';
import { Servico } from 'src/app/models/servico.interface';
import { ServicoService } from 'src/app/services/servico.service';
import { CommonUtils } from 'src/app/utils/utils';

@Component({
    templateUrl: './servicoCadastro.component.html',
    providers: [MessageService]
})
export class CadastroServicoComponent implements OnInit {
    servicoDialog: boolean = false;

    deleteServicoDialog: boolean = false;

    deleteServicosDialog: boolean = false;

    servicos: Servico[] | undefined;

    servico: Servico = {};

    selectedServicos: Servico[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] = [];

    home!: MenuItem;

    pageable: Pageable = new Pageable();

    formGroup!: FormGroup;

    pageServico!: Page;

    totalRecords: number = 10;

    titulo!: string;

    filter: GlobalFilter = new GlobalFilter();

    @BlockUI() blockUI!: NgBlockUI;

    constructor(private servicoService: ServicoService, private messageService: MessageService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildFormGroup()
        this.pageServicos(this.pageable, this.filter)
        this.items = [{ label: 'Serviços' }, { label: 'Tipos de Serviços' }, { label: 'Gerenciamento de serviços' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    }

    pageServicos(pageable: Pageable, filter: GlobalFilter) {
        this.blockUI.start('Carregando...')
        this.servicoService.buscarServicos(pageable, filter)
            .pipe(
                catchError(error => {
                    if (error == 500) {
                        this.blockUI.stop();
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                    }
                    return of();
                })
            )
            .subscribe(resp => {
                if (resp != null) {
                    this.servicos = resp.content
                    this.servicos?.map(r => {
                        r.precoStr = CommonUtils.formatCurrency(Number(r.preco))
                    })
                    let total = resp.totalElements;
                    this.totalRecords = total;
                }
                this.blockUI.stop();
            })
    }


    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            codigo: ['', Validators.required],
            tipo: ['', Validators.required],
            preco: [Validators.required],
            descricao: [''],
        });
    }

    saveServico() {
        if (this.servico.id) {
            this.update()
        } else {
            this.save()
        }
    }

    save() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.servicoService.save(this.formGroup.value)
                .pipe(
                    catchError(error => {
                        this.blockUI.stop();
                        if (error == 400) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Serviço já existe na base de dados.", life: 3000 });
                        }
                        if (error == 500) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                        }
                        this.formGroup.reset()
                        this.hideDialog()
                        return of();
                    })
                )
                .subscribe(resp => {
                    if (resp.id != null) {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
                    }
                    this.formGroup.reset()
                    this.hideDialog()
                    this.blockUI.stop();
                    this.pageServicos(this.pageable, this.filter)
                })
        }
    }

    update() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.servicoService.update(this.servico)
                .pipe(
                    catchError(error => {
                        this.blockUI.stop();
                        if (error == 400) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Serviço já existe na base de dados.", life: 3000 });
                        }
                        if (error == 500) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                        }
                        this.formGroup.reset()
                        this.hideDialog()
                        return of();
                    })
                )
                .subscribe(resp => {
                    if (resp.id != null) {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
                    }
                    this.formGroup.reset()
                    this.servico = {}
                    this.hideDialog()
                    this.blockUI.stop();
                    this.pageServicos(this.pageable, this.filter)
                })
        }
    }

    openNew() {
        this.servico = {};
        this.submitted = false;
        this.servicoDialog = true;
        this.titulo = "Novo Serviço"
    }

    deleteSelectedServicos() {
        this.deleteServicosDialog = true;
    }

    editarServico(servico: Servico) {
        this.servico = { ...servico };
        this.servicoDialog = true;
        this.titulo = "Editar Serviço"
    }

    deleteServico(servico: Servico) {
        this.deleteServicoDialog = true;
        this.servico = { ...servico };
    }

    confirmDeleteSelected() {
        this.deleteServicosDialog = false;
        this.servicos = this.selectedServicos
        const ids = this.servicos.map(servicos => servicos.id)
        this.servicoService.deleteAll(ids)
            .pipe(
                catchError(error => {
                    this.blockUI.stop();
                    if (error == 500 || error == 400) {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                    }
                    return of();
                })
            )
            .subscribe(resp => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
                this.servicos = []
                this.selectedServicos = [];
                this.blockUI.stop();
                this.pageServicos(this.pageable, this.filter)
            })
    }

    confirmDelete() {
        this.deleteServicoDialog = false;
        this.servicoService.delete(this.servico.id)
            .pipe(
                catchError(error => {
                    this.blockUI.stop();
                    if (error == 500 || error == 400) {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um erro inesperado.", life: 3000 });
                    }
                    return of();
                })
            )
            .subscribe(resp => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
                this.servico = {}
                this.blockUI.stop();
                this.pageServicos(this.pageable, this.filter)
            })
    }

    hideDialog() {
        this.servicoDialog = false;
        this.submitted = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    page(event: any) {
        this.pageable.page = event.first / event.rows;
        this.pageable.size = event.rows;
        this.pageable.sort = event.sortField != undefined ? event.sortField : ""
        this.filter.filter = event.globalFilter
        this.pageServicos(this.pageable, this.filter)
    }

}