import { Component, OnInit, ViewChild } from '@angular/core';
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

    clientes: Cliente[] = [];

    pageCliente!: Page;

    cliente: Cliente = {};

    selectedClientes: Cliente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    items: MenuItem[] = [];

    home!: MenuItem;

    titulo: any = 'Novo Cliente';

    pageable: Pageable = new Pageable();

    @BlockUI() blockUI!: NgBlockUI;

    constructor(
        private messageService: MessageService,
        private clienteService: ClienteService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.buildFormGroup()
        this.pageClientes(this.pageable.page, this.pageable.size)
        this.breadcrumb()
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
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

    pageClientes(page: number, size: number) {
        this.blockUI.start('Carregando...')
        this.clienteService.buscarTodosClientes()
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
                    this.clientes = resp
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
                    this.pageClientes(this.pageable.page, this.pageable.size)
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
                    this.pageClientes(this.pageable.page, this.pageable.size)
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
                this.pageClientes(this.pageable.page, this.pageable.size)
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
                this.pageClientes(this.pageable.page, this.pageable.size)
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
        this.pageClientes(this.pageable.page, this.pageable.size)
    }

}