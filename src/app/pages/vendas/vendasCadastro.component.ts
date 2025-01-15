import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GlobalFilter, Pageable } from 'src/app/models/pageable.interface';
import { VendaService } from 'src/app/services/venda.service';
import { Venda } from './../../models/venda.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
    styleUrls: ['./vendasCadastro.component.scss'],
    templateUrl: './vendasCadastro.component.html',
    providers: [MessageService]
})
export class CadastroVendasComponent implements OnInit {

    formGroup!: FormGroup;

    vendaDialog: boolean = false;

    deleteVendaDialog: boolean = false;

    deleteVendasDialog: boolean = false;

    vendas!: Venda[];

    venda: Venda = {
        data: '',
    };


    selectedVendas: Venda[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statusVenda: any[] = [];

    statusPagamento: any[] = [];

    formaPagamento: any[] = [];

    tipo: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] = [];

    parcelas: any[] = [];

    home!: MenuItem;

    habilitaParcelas: boolean = true;

    isNew: boolean = false;

    pageable: Pageable = new Pageable();

    filter: GlobalFilter = new GlobalFilter();

    titulo: string = "Vendas";

    showSpinner = false

    @BlockUI() blockUI!: NgBlockUI;
    totalRecords: number = 10;

    constructor(
        private vendaService: VendaService,
        private messageService: MessageService,
        private formBuilder: FormBuilder) {

        this.statusPagamento = [
            { label: "PENDENTE", value: "pendente" },
            { label: "PAGO", value: "pago" },
        ];

        this.tipo = [
            { label: "VENDA", value: "venda" },
            { label: "SERVIÇO", value: "serviço" },
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
        this.items = [{ label: 'Vendas' }, { label: 'Gerenciamento de Vendas' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
        this.buildFormGroup();
    }

    buildFormGroup() {
        this.formGroup = this.formBuilder.group({
            tipo: ['', Validators.required],
            data: ['', Validators.required],
            descricao: ['', Validators.required],
            valor: ['', Validators.required],
            formaPagamento: [, Validators.required],
            qtdParcelas: [{ value: '', disabled: true }],
            valorParcela: [{ value: '', disabled: true }],
            observacao: [{ value: null }]
        });
    }

    openNew() {
        this.venda = {
            data: this.formatData(new Date()),
            tipo: "VENDA",
            formaPagamento: "Dinheiro"
        };
        this.submitted = false;
        this.vendaDialog = true;
        this.isNew = true;
        this.titulo = "Venda"
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

    calculaValorParcelas(event: any) {
        let valor = Number(this.formGroup.get('valor')?.value);
        let formaPagamento = this.formGroup.get('formaPagamento')?.value;
        if (formaPagamento === "Crédito" && event.value != null && valor) {
            this.formGroup.get('valorParcela')?.setValue(valor / event.value);
        }
    }

    calculaParcelasPorValor(event: any) {
        let formaPagamento = this.formGroup.get('formaPagamento')?.value;
        let qtdParcelas = Number(this.formGroup.get('qtdParcelas')?.value);
        let valor = Number(event)
        if (formaPagamento === "Crédito" && qtdParcelas && valor) {
            if (valor != undefined && valor != null) {
                this.formGroup.get('valorParcela')?.setValue(valor / qtdParcelas);
            }
        }
    }

    deleteSelectedVendas() {
        this.deleteVendasDialog = true;
    }

    editVenda(product: Venda) {
        this.venda = { ...product };
        this.vendaDialog = true;
        this.titulo = "Venda"
    }

    deleteVenda(venda: Venda) {
        this.deleteVendaDialog = true;
        this.venda = { ...venda };
    }

    confirmDeleteSelected() {
        this.deleteVendasDialog = false;

    }

    confirmDelete() {
        this.deleteVendaDialog = false;
    }

    hideDialog() {
        this.vendaDialog = false;
        this.submitted = false;
    }

    saveVenda() {
        this.submitted = true;
    }

    private formatData(data: string | Date | null): string {
        if (!data) {
            return ''; // Retorna string vazia se a entrada for nula ou indefinida
        }

        try {
            let date: Date;

            // Se já for um objeto Date, usa diretamente
            if (data instanceof Date) {
                date = data;
            } else if (/\d{2}\/\d{2}\/\d{4}/.test(data)) {
                // Verifica se está no formato dd/MM/yyyy
                const [day, month, year] = data.split('/').map(Number);
                date = new Date(year, month - 1, day); // Converte para um objeto Date
            } else {
                // Tenta converter a string para um objeto Date
                date = new Date(data);
            }

            // Verifica se a data é válida
            if (!isNaN(date.getTime())) {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');

                return `${day}/${month}/${year} ${hours}:${minutes}`;
            }

            return ''; // Retorna string vazia se a data não for válida
        } catch (error) {
            return ''; // Retorna string vazia em caso de erro
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportToExcel() {
        if (this.vendas == undefined || this.vendas.length == 0) {
            this.messageService.add({ severity: 'info', summary: 'Exportação não realizada', detail: "Não há dados disponíveis para exportar.", life: 4000 });
            return
        }

        const worksheetData = this.vendas.map((venda: any) => ({
            'Tipo': venda.tipo,
            'Data/Hora': venda.data,
            'Descrição': venda.descricao,
            'Forma de Pagamento': venda.formaPagamento,
            'Valor': venda.valor,
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas');

        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const today = new Date();
        const formattedDate =
            String(today.getDate()).padStart(2, '0') +
            String(today.getMonth() + 1).padStart(2, '0') +
            today.getFullYear();

        const fileName = `vendas_${formattedDate}.xlsx`;

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