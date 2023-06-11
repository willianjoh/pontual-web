import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroServicoComponent } from './servicoCadastro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CadastroServicoComponent }
	])],
	exports: [RouterModule]
})
export class CadastroServicoRoutingModule { }