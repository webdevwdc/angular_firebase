import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ProjectTypeRoutingModule } from './project-type-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProjectTypeRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    PipeModule
  ],
  declarations: [ListComponent, AddComponent, EditComponent]
})
export class ProjectTypeModule { }
