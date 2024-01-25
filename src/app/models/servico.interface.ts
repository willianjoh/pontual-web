  export interface Servico {
    id?: number;
    codigo?: string;
    tipo?: string;
    descricao?: string;
    preco?: number;
    precoStr?: string;
  }

  export interface ServicoPage {
    id?: number;
    codigo?: string;
    tipo?: string;
    descricao?: string;
    preco?: string;
  }

  export interface ServicoList {
    id?: number;
    codigo?: string;
    tipo?: string;
  }