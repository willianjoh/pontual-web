export class Pageable {
    page: number = 0;
    size: number = 10;
}

export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

export interface Page {
    content?: Array<any>;
    pageable?: Pageable;
    last?: boolean;
    totalElements: number;
    totalPages?: number;
    size?: number;
    number?: number;
    sort?: Sort;
    first?: boolean;
    numberOfElements?: number;
    empty?: boolean;
};

export interface Pageable {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    filtro: string;
    unpaged: boolean;
};

export class Sort {
    empty: boolean = true;
    sorted: boolean = true;
    unsorted: boolean = true;
};

export class GlobalFilter {
    filter: string = "";
}

