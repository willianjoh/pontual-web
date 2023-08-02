import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Page } from '../models/pageable.interface';

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

  buscarClientes(page: number, size: number): Observable<Page> {
    return this.http.get<Page>(`${this.apiURL}/?page=${page}&size=${size}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarTodosClientes(): Observable<Cliente []> {
    return this.http.get<Cliente []>(`${this.apiURL}/todos`)
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
