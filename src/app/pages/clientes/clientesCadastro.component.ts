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
import { U } from '@fullcalendar/core/internal-common';

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
    cliente: Cliente = {};
    selectedClientes: Cliente[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    items: MenuItem[] = [];
    home!: MenuItem;
    titulo: string = 'Novo Cliente';
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
        this.initializeComponent();
    }

    private initializeComponent() {
        this.buildFormGroup();
        this.initializeBreadcrumb();
        this.initializeColumns();
        this.pageClientes(this.pageable, this.filter);
    }

    private initializeBreadcrumb() {
        this.items = [{ label: 'Clientes' }, { label: 'Clientes' }, { label: 'Gerenciamento de Clientes' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    }

    private initializeColumns() {
        this.cols = [
            { field: 'nome', header: 'Nome' },
            { field: 'sobrenome', header: 'Sobrenome' },
            { field: 'cpf', header: 'CPF' },
            { field: 'email', header: 'Email' },
            { field: 'celular', header: 'Celular' },
            { field: 'fixo', header: 'Fixo' }
        ];
    }

    private buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            nome: ['', Validators.required],
            email: ['', Validators.email],
            celular: ['', Validators.required],
            cpf: [''],
            fixo: [''],
        });
    }

    private handleError(error: any, message: string) {
        this.blockUI.stop();
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: message, life: 3000 });
        return of();
    }

    private resetFormAndCloseDialog() {
        this.formGroup.reset();
        this.hideDialog();
        this.blockUI.stop();
    }

    pageClientes(pageable: Pageable, filter: GlobalFilter) {
        this.blockUI.start('Carregando...');
        this.clienteService.buscarClientes(pageable, filter)
            .pipe(
                catchError(error => this.handleError(error, 'Ocorreu um erro inesperado.'))
            )
            .subscribe(resp => {
                this.blockUI.stop();
                if (resp) {
                    this.clientes = resp.content;
                    this.totalRecords = resp.totalElements;
                }
            });
    }

    isValidated(field: string): boolean | undefined {
        return this.formGroup.get(field)?.invalid && (this.formGroup.get(field)?.dirty || this.formGroup.get(field)?.touched && this.submitted);
    }

    isEmailValid(field: string): boolean | undefined {
        return this.formGroup.get(field)?.hasError('email');
    }

    saveCliente() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.cliente.id ? this.updateCliente() : this.createCliente();
        }
    }

    private createCliente() {
        this.blockUI.start('Carregando...');
        this.clienteService.save(this.formGroup.value)
            .pipe(
                catchError(error => this.handleError(error, 'Erro ao salvar o cliente.'))
            )
            .subscribe(resp => {
                if (resp?.id) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo com sucesso.', life: 3000 });
                }
                this.resetFormAndCloseDialog();
                this.pageClientes(this.pageable, this.filter);
            });
    }

    private updateCliente() {
        this.blockUI.start('Carregando...');
        this.clienteService.update(this.cliente)
            .pipe(
                catchError(error => this.handleError(error, 'Erro ao atualizar o cliente.'))
            )
            .subscribe(resp => {
                if (resp?.id) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso.', life: 3000 });
                }
                this.resetFormAndCloseDialog();
                this.pageClientes(this.pageable, this.filter);
            });
    }

    openNew() {
        this.cliente = {};
        this.submitted = false;
        this.clienteDialog = true;
        this.titulo = 'Novo Cliente';
    }

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
        this.titulo = 'Editar Cliente';
    }

    deleteCliente(cliente: Cliente) {
        this.deleteClienteDialog = true;
        this.cliente = { ...cliente };
    }

    confirmDeleteSelected() {
        this.deleteClientesDialog = false;
        const ids = this.selectedClientes.map(cliente => cliente.id);
        this.deleteClientes(ids);
    }

    private deleteClientes(ids : any) {
        this.blockUI.start('Carregando...');
        this.clienteService.deleteAll(ids)
            .pipe(
                catchError(error => this.handleError(error, 'Erro ao excluir os clientes.'))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Clientes excluídos com sucesso.', life: 3000 });
                this.selectedClientes = [];
                this.pageClientes(this.pageable, this.filter);
            });
    }

    confirmDelete() {
        this.deleteClienteDialog = false;
        if (this.cliente?.id) {
            this.deleteClienteById(this.cliente.id);
        }
    }

    private deleteClienteById(id: number) {
        this.blockUI.start('Carregando...');
        this.clienteService.delete(id)
            .pipe(
                catchError(error => this.handleError(error, 'Erro ao excluir o cliente.'))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso.', life: 3000 });
                this.pageClientes(this.pageable, this.filter);
            });
    }

    deleteSelectedClientes() {
        this.deleteClientesDialog = true;
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
        this.pageable.sort = event.sortField || '';
        this.filter.filter = event.globalFilter;
        this.pageClientes(this.pageable, this.filter);
    }
}
