import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalFilter, Page, Pageable } from '../models/pageable.interface';
import { Venda } from '../models/venda.interface';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  apiURL: string = environment.apiURLBase + '/api/vendas'

  constructor(private http: HttpClient) { }

  save(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiURL, venda)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(venda: Venda): Observable<Venda> {
    return this.http.put<Venda>(this.apiURL, venda)
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

  buscarClientes(pageable: Pageable, filter: GlobalFilter): Observable<Page> {
    const options = { params: Object.assign(pageable) };
    return this.http.post<Page>(`${this.apiURL}/listarTodos`, filter, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarTodosClientes(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiURL}/todos`)
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
