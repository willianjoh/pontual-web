import { Cliente, ClienteList } from "./cliente.interface";

export interface OrdemServico {
    id?: number;
    codigo?: string;
    dataOrcamento: string | null;
    dataEntrega: string | null;
    cliente: ClienteList;
    servico?: string;
    valorServico?: number;
    status?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: number;
    observacao?: string;
  }

  export interface OrdemServicoPage {
    id?: number;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente: Cliente;
    descricao?: String;
    valorServico?: string;
    statusServico?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: string;
    observacao?: string;
  }
  