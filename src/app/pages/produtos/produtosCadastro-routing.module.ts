import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProdutosCadastroComponent } from './produtosCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProdutosCadastroComponent }
	])],
	exports: [RouterModule]
})
export class ProdutosCadastroRoutingModule { }