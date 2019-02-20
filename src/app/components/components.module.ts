import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ComponentsRoutingModule } from './components-routing.module';
import { CoreModule } from '../core/core.module';
import { PrimeModule } from '../primengModule';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProjectTypeComponent } from './project-type/project-type.component';
import { CategoryComponent } from './category/category.component';
import { AssociateComponent } from './associate/associate.component';

import { PortalComponent } from './portal/portal.component';
import { ProfileComponent } from './profile/profile.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { ShiftComponent } from './shift/shift.component';
import { TeamOpportunityComponent } from './team-opportunity/team-opportunity.component';
import { CoOrdinatorComponent } from './co-ordinator/co-ordinator.component';
import { TeamContractsComponent } from './team-contracts/team-contracts.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsRoutingModule,
    PrimeModule,
    CoreModule,
    FlexLayoutModule,
    FormsModule,
  ],
  declarations: [
    CategoryComponent,
    AssociateComponent,
    PortalComponent,
    ProfileComponent,
    OpportunityComponent,
    ProjectTypeComponent,
    ShiftComponent,
    TeamOpportunityComponent,
    CoOrdinatorComponent,
    TeamContractsComponent,
  ],
  providers: [DatePipe],
})
export class ComponentsModule { }
