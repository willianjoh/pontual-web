import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { GlobalFilter, Page, Pageable } from 'src/app/models/pageable.interface';
import { Produto } from 'src/app/models/produto.interface';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
    templateUrl: './produtosCadastro.component.html',
    providers: [MessageService]
})
export class CadastroProdutosComponent implements OnInit {
    produtoDialog: boolean = false;

    deleteProdutoDialog: boolean = false;

    deleteProdutosDialog: boolean = false;

    produtos: Produto [] | undefined;

    produto: Produto = {};

    selectedProdutos: Produto[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] = [];

    home!: MenuItem;

    pageable: Pageable = new Pageable();

    formGroup!: FormGroup;

    pageProduto!: Page;

    totalRecords: number = 10;

    titulo!: string;

    filter: GlobalFilter = new GlobalFilter();

    @BlockUI() blockUI!: NgBlockUI;

    constructor(private produtoService: ProdutoService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.buildFormGroup()
        this.pageProdutos(this.pageable, this.filter)
        this.items = [{ label: 'Produtos' }, { label: 'Produtos' }, { label: 'Gerenciamento de Produtos' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    }

    isValidated(formulario: FormGroup, field: string) {
        return formulario.get(field)?.invalid && (formulario.get(field)?.dirty || formulario.get(field)?.touched && this.submitted);
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            codigo: ['', Validators.required],
            nome: ['', Validators.required],
            modelo: ['', Validators.required],
            valor: [Validators.required],
            descricao: ['', Validators.maxLength(255)],
        });
    }

    saveProduto() {
        if (this.produto.id) {
            this.update()
        } else {
            this.save()
        }
    }

    save() {
        this.submitted = true;
        console.log(this.formGroup.value)
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.produtoService.save(this.formGroup.value)
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
                    this.pageProdutos(this.pageable, this.filter)
                })
        }
    }

    pageProdutos(pageable: Pageable, filter: GlobalFilter) {
        this.blockUI.start('Carregando...')
        this.produtoService.buscarProdutos(pageable, filter)
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
                    this.produtos = resp.content
                    let total = resp.totalElements;
                    this.totalRecords = total;
                }
                this.blockUI.stop();
            })
    }

    update() {
        this.submitted = true;
        if (this.formGroup.valid) {
            this.blockUI.start('Carregando...')
            this.produtoService.update(this.produto)
                .pipe(
                    catchError(error => {
                        this.blockUI.stop();
                        if (error == 400) {
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Produto já existe na base de dados.", life: 3000 });
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
                    this.produto = {}
                    this.hideDialog()
                    this.blockUI.stop();
                    this.pageProdutos(this.pageable, this.filter)
                })
        }
    }


    openNew() {
        this.produto = {};
        this.submitted = false;
        this.produtoDialog = true;
        this.titulo = "Novo Produto"
    }

    deleteSelectedProducts() {
        this.deleteProdutosDialog = true;
    }

    editarProduto(produto: Produto) {
        this.produto = { ...produto };
        this.produtoDialog = true;
        this.titulo = "Editar Produto"
    }

    deleteProduto(produto: Produto) {
        this.deleteProdutoDialog = true;
        this.produto = { ...produto };
    }

    confirmDeleteSelected() {
        this.deleteProdutosDialog = false;
        this.produtos = this.selectedProdutos
        const ids = this.produtos.map(produtos => produtos.id)
        this.produtoService.deleteAll(ids)
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
                this.produtos = []
                this.selectedProdutos = [];
                this.blockUI.stop();
                this.pageProdutos(this.pageable, this.filter)
            })
    }

    confirmDelete() {
        this.deleteProdutoDialog = false;
        this.produtoService.delete(this.produto.id)
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
                this.produto = {}
                this.blockUI.stop();
                this.pageProdutos(this.pageable, this.filter)
            })
    }

    hideDialog() {
        this.produtoDialog = false;
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
        this.pageProdutos(this.pageable, this.filter)
    }

}