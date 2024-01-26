import { Cliente, ClienteList } from "./cliente.interface";
import { Servico, ServicoList } from "./servico.interface";

export interface OrdemServico {
    id?: number;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente?: ClienteList;
    servico?: ServicoList;
    valor?: string;
    status?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: string;
    observacao?: string;
  }

  export interface OrdemServicoPage {
    id?: number;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente?: Cliente;
    servico?: Servico;
    valor?: string;
    statusServico?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: string;
    observacao?: string;
  }
  