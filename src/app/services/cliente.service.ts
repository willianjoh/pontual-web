import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  salvar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiURL, cliente)
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
