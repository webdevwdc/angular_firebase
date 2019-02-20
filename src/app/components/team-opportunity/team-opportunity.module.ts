import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

import { TeamOpportunityRoutingModule } from './team-opportunity-routing.module';
import { TeamOpportunityService } from './team-opportunity.service';

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
    TeamOpportunityRoutingModule
  ],
  declarations: [
    EditComponent,
    ListComponent
  ],
  providers: [
    AngularFirestore,
    TeamOpportunityService
  ]
})
export class TeamOpportunityModule { }
