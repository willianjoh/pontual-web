import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroVendasComponent } from './vendasCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CadastroVendasComponent }
	])],
	exports: [RouterModule]
})
export class CadastroVendasRoutingModule { }