import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdemServico } from '../models/ordemServico.interface';
import { GlobalFilter, Page, Pageable } from '../models/pageable.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdemServicoService {
  apiURL: string = environment.apiURLBase + '/api/ordemServico'

  constructor(private http: HttpClient) { }

  save(ordemServico: OrdemServico): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.apiURL, ordemServico)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(ordemServico: OrdemServico): Observable<OrdemServico> {
    return this.http.put<OrdemServico>(this.apiURL, ordemServico)
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

  buscarOrdemServicos(pageable: Pageable, filter: GlobalFilter): Observable<Page> {
    const options = {params: Object.assign(pageable)};
    return this.http.post<Page>(`${this.apiURL}/listarTodos`, filter, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarTodasOrdemServicos(): Observable<OrdemServico []> {
    return this.http.get<OrdemServico []>(`${this.apiURL}/todos`)
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
