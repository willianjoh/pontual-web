export class Pageable {
    page: number = 0;
    size: number = 10;
}

export interface Page {
    content: Array<any>;
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
};

export interface Pageable {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
};

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
};

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
};

