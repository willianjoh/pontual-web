import { GlobalFilter, Sort } from './../../models/pageable.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Cliente, ClientePage } from 'src/app/models/cliente.interface';
import { Page, Pageable } from 'src/app/models/pageable.interface';
import { ClienteService } from './../../services/cliente.service';

@Component({
    templateUrl: './clientesCadastro.component.html',
    providers: [MessageService]
})
export class CadastroClientesComponent implements OnInit {

    formGroup!: FormGroup;

    clienteDialog: boolean = false;

    deleteClienteDialog: boolean = false;

    deleteClientesDialog: boolean = false;

    clientes: ClientePage[] | undefined;

    pageCliente!: Page;

    cliente: Cliente = {};

    selectedClientes: Cliente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    items: MenuItem[] = [];

    home!: MenuItem;

    titulo: any = 'Novo Cliente';

    totalRecords: number = 10;

    filter: GlobalFilter = new GlobalFilter();

    pageable: Pageable = new Pageable();

    @BlockUI() blockUI!: NgBlockUI;

    constructor(
        private messageService: MessageService,
        private clienteService: ClienteService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.buildFormGroup()
        this.pageClientes(this.pageable, this.filter)
        this.breadcrumb()
        this.cols = [
            { field: 'nome', header: 'Nome' },
            { field: 'sobrenome', header: 'Sobrenome' },
            { field: 'cpf', header: 'CPF' },
            { field: 'email', header: 'Email' },
            { field: 'celular', header: 'Celular' },
            { field: 'fixo', header: 'Fixo' }
        ];
    }

  

    breadcrumb() {
        this.items = [{ label: 'Clientes' }, { label: 'Clientes' }, { label: 'Gerenciamento de Clientes' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            nome: ['', Validators.required],
            email: ['', Validators.email],
            sobrenome: ['', Validators.required],
            celular: ['', Validators.required],
            cpf: [''],
            fixo: [''],
        });
    }

    pageClientes(pageable: Pageable, filter: GlobalFilter) {
        this.blockUI.start('Carregando...')
        this.clienteService.buscarClientes(pageable, filter)
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
                    this.clientes = resp.content
                    let total = resp.totalElements;
                    this.totalRecords = total;
                }
                this.blockUI.stop();
            })
    }

    pageteste(event: any) {
        console.log(event)
    }

    isValidated(formulario: FormGroup, field: string) {
        return formulario.get(field)?.invalid && (formulario.get(field)?.dirty || formulario.get(field)?.touched && this.submitted);
    }

    isEmailValid(formulario: FormGroup, field: string) {
        return formulario.get(field)?.hasError('email');
    }

    saveCliente() {
        if (this.cliente.id) {
            this.update()
        } else {
            this.save()
        }
    }

    save() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.clienteService.save(this.formGroup.value)
                .pipe(
                    catchError(error => {
                        this.blockUI.stop();
                        if (error == 400) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Usuário já existe na base de dados.", life: 3000 });
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
                    this.pageClientes(this.pageable, this.filter)
                })
        }
    }

    update() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.clienteService.update(this.cliente)
                .pipe(
                    catchError(error => {
                        this.blockUI.stop();
                        if (error == 400) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Usuário já existe na base de dados.", life: 3000 });
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
                    this.cliente = {}
                    this.hideDialog()
                    this.blockUI.stop();
                    this.pageClientes(this.pageable, this.filter)
                })
        }
    }

    openNew() {
        this.cliente = {}
        this.submitted = false;
        this.clienteDialog = true;
        this.titulo = "Novo Cliente"
    }

    deleteSelectedClientes() {
        this.deleteClientesDialog = true;
    }

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
        this.titulo = "Editar Cliente"
    }

    deleteCliente(cliente: Cliente) {
        this.deleteClienteDialog = true;
        this.cliente = { ...cliente };
    }

    confirmDeleteSelected() {
        this.deleteClientesDialog = false;
        this.clientes = this.selectedClientes
        const ids = this.clientes.map(cliente => cliente.id)
        this.clienteService.deleteAll(ids)
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
                this.clientes = []
                this.selectedClientes = [];
                this.blockUI.stop();
                this.pageClientes(this.pageable, this.filter)
            })
    }

    confirmDelete() {
        this.deleteClienteDialog = false;
        this.cliente.id
        this.clienteService.delete(this.cliente.id)
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
                this.cliente = {}
                this.blockUI.stop();
                this.pageClientes(this.pageable, this.filter)
            })
    }

    hideDialog() {
        this.clienteDialog = false;
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
        this.pageClientes(this.pageable, this.filter)
    }

}