import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroProdutosComponent } from './produtosCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CadastroProdutosComponent }
	])],
	exports: [RouterModule]
})
export class ProdutosCadastroRoutingModule { }