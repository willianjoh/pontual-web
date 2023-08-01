import { error } from 'console';
import { AccessComponent } from './../../demo/components/auth/access/access.component';
import { ClienteService } from './../../services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Cliente, ClientePage } from 'src/app/models/cliente.interface';
import { catchError, of } from 'rxjs';
import { Pageable } from 'src/app/models/pageable.interface';
import { stringify } from 'querystring';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    templateUrl: './clientesCadastro.component.html',
    providers: [MessageService]
})
export class CadastroClientesComponent implements OnInit {
    formGroup!: FormGroup;

    first: number = 0;

    rows: number = 10;

    clienteDialog: boolean = false;

    deleteClienteDialog: boolean = false;

    deleteClientesDialog: boolean = false;

    clientes: ClientePage[] = [];

    cliente: Cliente = {};


    product: Product = {};

    selectedClientes: Cliente[] = [];

    submitted: boolean = false;


    rowsPerPageOptions = [10, 20, 30];

    items: MenuItem[] = [];

    home!: MenuItem;

    isNew: boolean = false;

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
        this.clienteService.buscarClientes(page, size)
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
                if (resp != null && resp.content) {
                    this.clientes = resp.content
                }
                this.blockUI.stop();
            })
    }

    isValidated(formulario: FormGroup, field: string) {
        return formulario.get(field)?.invalid && (formulario.get(field)?.dirty || formulario.get(field)?.touched && this.submitted);
    }

    isEmailValid(formulario: FormGroup, field: string) {
        return formulario.get(field)?.hasError('email');
    }


    saveCliente() {
        this.blockUI.start('Carregando...')
        if (this.cliente.id) {
            this.update()
        } else {
            this.save()
        }
    }

    save() {
        if (this.formGroup.valid) {
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
        if (this.formGroup.valid) {
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

    deleteSelectedProducts() {
        this.deleteClientesDialog = true;
    }

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
        this.titulo = "Editar Cliente"
    }

    deleteProduct(cliente: Cliente) {
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
        this.clientes = this.clientes.filter(val => val.id !== this.cliente.id);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
        this.product = {};
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