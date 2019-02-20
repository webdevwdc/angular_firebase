import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { CoOrdinatorService } from './co-ordinator.service';
import { CoOrdinatorRoutingModule } from './co-ordinator-routing.module';


@NgModule({
  imports: [
    CommonModule,
    CoOrdinatorRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PipeModule
  ],
  declarations: [ ListComponent, AddComponent, EditComponent],
  providers: [AngularFirestore, CoOrdinatorService]
})
export class CoOrdinatorModule { }
