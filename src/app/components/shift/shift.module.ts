import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

import { ShiftRoutingModule } from './shift-routing.module';
import { ShiftService } from './shift.service';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { MyshiftComponent } from './myshift/myshift.component';

@NgModule({
  imports: [
    CommonModule,
    ShiftRoutingModule,
    PipeModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeModule
  ],
  declarations: [EditComponent, ListComponent, MyshiftComponent],
  providers: [
    AngularFirestore,
    ShiftService
  ]
})
export class ShiftModule { }
