
export interface Venda {
    id?: number;
    tipo?: string;
    descricao?: string;
    data: string | null;
    valor?: number;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: number;
    observacao?: string;
  }

  export interface VendaPage {
    id?: number;
    descricao?: string;
    data: string | null;
    valor?: number;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: number;
    observacao?: string;
  }
  