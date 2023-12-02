import { ClienteOrderService } from "./cliente.interface";
import { StatusPagamento } from "./statusPagmento.interface";
import { StatusServico } from "./statusServico.interface";

export interface OrdemServico {
    id?: number;
    tipoServico?: string;
    codigo?: string;
    dataOrcamento?: string;
    dataEntrega?: string;
    cliente?: ClienteOrderService;
    valor?: string;
    statusServico?: StatusServico;
    statusPagamento?: StatusPagamento;
    formaPagamento?: string;
    qtdParcelas?: string;
    valorParcela?: string;
    observacao?: string;
  }

  export interface ClienteList {
    id?: number;
    nome?: string;
    sobrenome?: string;
  }

  export interface ClientePage {
    id?: number;
    nome?: string;
    sobrenome?: string;
    cpf?: string;
    email?: string;
    celular?: string;
    fixo?: string;
  }
  