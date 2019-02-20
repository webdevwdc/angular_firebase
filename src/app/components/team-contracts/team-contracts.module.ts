import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamContractsRoutingModule } from './team-contracts-routing.module';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

import { ListComponent } from './list/list.component';
import { OpportunityService } from '../opportunity/opportunity.service';

@NgModule({
  imports: [
    CommonModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PipeModule,
    TeamContractsRoutingModule
  ],
  declarations: [ListComponent],
  providers: [
    AngularFirestore,
    OpportunityService
  ]
})
export class TeamContractsModule { }
