import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdemServicoProdutosComponent } from './ordemServicoCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrdemServicoProdutosComponent }
	])],
	exports: [RouterModule]
})
export class  OrdemServicoCadastroRoutingModule { }