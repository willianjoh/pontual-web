import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalFilter, Page, Pageable } from '../models/pageable.interface';
import { Produto } from '../models/produto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  apiURL: string = environment.apiURLBase + '/api/produto'

  constructor(private http: HttpClient) { }

  save(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiURL, produto)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(this.apiURL, produto)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAll(ids: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/deleteAllById`, ids)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarProdutos(pageable: Pageable, filter: GlobalFilter): Observable<Page> {
    const options = {params: Object.assign(pageable)};
    return this.http.post<Page>(`${this.apiURL}/listarTodos`, filter, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let errorCode;
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorCode = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorCode = error.status;
    }
    return throwError(errorCode);
  };

}
