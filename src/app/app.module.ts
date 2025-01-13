import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { ProductService } from './demo/service/product.service';
import { AppLayoutModule } from './layout/app.layout.module';
import { CadastroClientesComponent } from './pages/clientes/clientesCadastro.component';
import { OrdemServicoProdutosComponent } from './pages/ordem-servico/ordemServicoCadastro.component';
import { CadastroServicoComponent } from './pages/servicos/servicoCadastro.component';
import { CadastroVendasComponent } from './pages/vendas/vendasCadastro.component';
import { PaginatorModule } from 'primeng/paginator';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AutoCompleteModule } from 'primeng/autocomplete';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt); 

@NgModule({
    declarations: [
        AppComponent, 
        NotfoundComponent, 
        CadastroClientesComponent, 
        CadastroVendasComponent,
        CadastroServicoComponent,
        OrdemServicoProdutosComponent
    ],
    imports: [
        AppRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppLayoutModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        BreadcrumbModule,
        DialogModule,
        CalendarModule,
        InputMaskModule,
        PaginatorModule,
        ProgressSpinnerModule,
        FullCalendarModule,
        AutoCompleteModule,
        BlockUIModule.forRoot()
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
