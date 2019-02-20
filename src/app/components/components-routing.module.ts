import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../core/services';
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


const routes: Routes = [
  {
    path: '',
    redirectTo: 'category'
  }, {
    path: 'category',
    loadChildren: './category/category.module#CategoryModule',
    component: CategoryComponent,
    canLoad: [AuthService]
  },
  {
    path: 'associate',
    loadChildren: './associate/associate.module#AssociateModule',
    component: AssociateComponent,
    canLoad: [AuthService]
  },
  {
    path: 'portal',
    loadChildren: './portal/portal.module#PortalModule',
    component: PortalComponent,
    canLoad: [AuthService]
  }, {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
    component: ProfileComponent,
    canLoad: [AuthService]
  }, {
    path: 'opportunity',
    loadChildren: './opportunity/opportunity.module#OpportunityModule',
    component: OpportunityComponent,
    canLoad: [AuthService]
  },
  {
    path: 'team-opportunity',
    loadChildren: './team-opportunity/team-opportunity.module#TeamOpportunityModule',
    component: TeamOpportunityComponent,
    canLoad: [AuthService]
  },
  {
    path: 'team-contracts',
    loadChildren: './team-contracts/team-contracts.module#TeamContractsModule',
    component: TeamContractsComponent,
    canLoad: [AuthService]
  },
  {
    path: 'project-type',
    loadChildren: './project-type/project-type.module#ProjectTypeModule',
    component: ProjectTypeComponent,
    canLoad: [AuthService]
  },
  {
    path: 'shift',
    loadChildren: './shift/shift.module#ShiftModule',
    component: ShiftComponent,
    canLoad: [AuthService]
  },
  {
    path: 'coordinator',
    loadChildren: './co-ordinator/co-ordinator.module#CoOrdinatorModule',
    component: CoOrdinatorComponent,
    canLoad: [AuthService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
