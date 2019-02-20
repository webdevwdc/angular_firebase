import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService } from './portal.service';
import { PortalRoutingModule } from './portal-routing.module';
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
        PortalRoutingModule,
        PrimeModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        PipeModule
    ],
    declarations: [ListComponent, AddComponent, EditComponent],
    providers: [AngularFirestore, PortalService]
})
export class PortalModule { }
