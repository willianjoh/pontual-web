import { Cliente, ClienteList } from "./cliente.interface";
import { Servico, ServicoList } from "./servico.interface";

export interface OrdemServico {
    id?: number;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente?: ClienteList;
    tipoServico?: ServicoList;
    valorServico?: number;
    status?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: number;
    valorParcela?: number;
    observacao?: string;
  }

  export interface OrdemServicoPage {
    id?: number;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente?: Cliente;
    tipoServico?: Servico;
    valorServico?: string;
    statusServico?: string;
    statusPagamento?: string;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: string;
    observacao?: string;
  }
  