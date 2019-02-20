import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

import { OpportunityRoutingModule } from './opportunity-routing.module';
import { OpportunityService } from './opportunity.service';

import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PipeModule,
    OpportunityRoutingModule
  ],
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent
  ],
  providers: [
    AngularFirestore,
    OpportunityService
  ]
})
export class OpportunityModule { }
