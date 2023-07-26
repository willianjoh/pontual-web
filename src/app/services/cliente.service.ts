import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  apiURL: string = environment.apiURLBase + '/api/cliente'

  constructor(private http: HttpClient) {}

  salvar(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.apiURL, cliente)
  }
}
