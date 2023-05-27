import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroClientesComponent } from './clientesCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CadastroClientesComponent }
	])],
	exports: [RouterModule]
})
export class CadastroClientesRoutingModule { }