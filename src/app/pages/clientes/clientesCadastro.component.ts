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

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    clientes: ClientePage[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

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
        this.items = [{ label: 'Clientes' }, { label: 'Clientes' }, { label: 'Gerenciamento de Clientes' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
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

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            nome: ['', Validators.required],
            email: ['', Validators.email],
            sobrenome: ['', Validators.required],
            contato: ['', Validators.required],
            cpf: [''],
            contatoFixo: [''],
        });
    }

    saveCliente() {
        this.blockUI.start('Carregando...')
        if (this.formGroup.valid) {
            this.clienteService.salvar(this.formGroup.value)
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

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
        this.isNew = true;
        this.titulo = "Novo Cliente"
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
        this.titulo = "Editar Cliente"
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso.', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente cadastrado', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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