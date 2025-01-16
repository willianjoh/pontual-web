import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente, ClienteList } from '../models/cliente.interface';
import { GlobalFilter, Page, Pageable } from '../models/pageable.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  apiURL: string = environment.apiURLBase + '/api/cliente'

  constructor(private http: HttpClient) { }

  save(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiURL, cliente)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.apiURL, cliente)
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

  getAllClientes(): Observable<ClienteList[]> {
    return this.http.get<ClienteList[]>(`${this.apiURL}/listarTodos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarTodosClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiURL}/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  handleError(error: HttpErrorResponse) {
    let errorResponse = {
      status: error.status,
      message: 'Ocorreu um erro desconhecido',
      path: null,
    };
  
    if (error.error instanceof ErrorEvent) {
      errorResponse.message = error.error.message;
    } else {
      if (error.error) {
        errorResponse.message = error.error.message || error.message;
        errorResponse.path = error.error.path || null;
      }
    }
    return throwError(() => errorResponse);
  }

}
