import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, of } from 'rxjs';
import { Cliente, ClientePage } from 'src/app/models/cliente.interface';
import { Pageable } from 'src/app/models/pageable.interface';
import { GlobalFilter } from './../../models/pageable.interface';
import { ClienteService } from './../../services/cliente.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
    templateUrl: './clientesCadastro.component.html',
    providers: [MessageService]
})
export class CadastroClientesComponent implements OnInit {

    formGroup!: FormGroup;
    clienteDialog: boolean = false;
    deleteClienteDialog: boolean = false;
    deleteClientesDialog: boolean = false;
    clientes!: ClientePage[];
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
        this.items = [{ label: 'Clientes' }, { label: 'Gerenciamento de Clientes' }];
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
        this.messageService.add({ severity: 'error', summary: 'Ocorreu um erro', detail: message, life: 4000 });
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
                    this.clientes = resp.content || [];
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
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(resp => {
                if (resp?.id) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo com sucesso.', life: 4000 });
                }
                this.resetFormAndCloseDialog();
                this.pageClientes(this.pageable, this.filter);
            });
    }

    private updateCliente() {
        this.blockUI.start('Carregando...');
        this.clienteService.update(this.cliente)
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(resp => {
                if (resp?.id) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso.', life: 4000 });
                }
                this.resetFormAndCloseDialog();
                this.pageClientes(this.pageable, this.filter);
            });
    }

    openNew() {
        this.cliente = {};
        this.submitted = false;
        this.clienteDialog = true;
        this.titulo = 'Cliente';
    }

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
        this.titulo = 'Cliente';
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

    private deleteClientes(ids: any) {
        this.blockUI.start('Carregando...');
        this.clienteService.deleteAll(ids)
            .pipe(
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Clientes excluídos com sucesso.', life: 4000 });
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
                catchError(error => this.handleError(error, error.message))
            )
            .subscribe(() => {
                this.blockUI.stop();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso.', life: 4000 });
                this.pageClientes(this.pageable, this.filter);
            });
    }

    deleteSelectedClientes() {
        this.deleteClientesDialog = true;
    }


    hideDialog() {
        this.formGroup.reset()
        this.clienteDialog = false;
        this.submitted = false;
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
        this.pageClientes(this.pageable, this.filter);
    }

    exportToExcel() {
        if (this.clientes == undefined || this.clientes.length == 0) {
            this.messageService.add({ severity: 'info', summary: 'Exportação não realizada', detail: "Não há dados disponíveis para exportar.", life: 4000 });
            return
        }

        const worksheetData = this.clientes.map((cliente: any) => ({
            'Nome': cliente.nome,
            'CPF': cliente.cpf,
            'Email': cliente.email,
            'Contato': cliente.celular
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const today = new Date();
        const formattedDate =
            String(today.getDate()).padStart(2, '0') +
            String(today.getMonth() + 1).padStart(2, '0') +
            today.getFullYear();

        const fileName = `clientes_${formattedDate}.xlsx`;

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
