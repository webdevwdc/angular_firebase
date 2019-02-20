import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PipeModule
  ],
  declarations: [ListComponent, AddComponent, EditComponent],
  providers: [AngularFirestore, ProfileService]
})
export class ProfileModule { }
