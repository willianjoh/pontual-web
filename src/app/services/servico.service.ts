import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalFilter, Page, Pageable } from '../models/pageable.interface';
import { Servico, ServicoList } from '../models/servico.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  apiURL: string = environment.apiURLBase + '/api/servico'

  constructor(private http: HttpClient) { }

  save(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.apiURL, servico)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(this.apiURL, servico)
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

  buscarServicos(pageable: Pageable, filter: GlobalFilter): Observable<Page> {
    const options = {params: Object.assign(pageable)};
    return this.http.post<Page>(`${this.apiURL}/listarTodos`, filter, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllServicos(): Observable<ServicoList[]> {
    return this.http.get<ServicoList[]>(`${this.apiURL}/listarTodos`)
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
