import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { CoOrdinatorService } from '../co-ordinator.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  coordinatorEditForm: FormGroup;
  formInvalid: boolean;
  extra: any;
  currentPage: number;
  usersData: any;

  constructor(
    public _coordinateService: CoOrdinatorService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService
  ) {
    this.formInvalid = true;
    this.coordinatorEditForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.ac.params.subscribe(params => {
      this.ac.queryParams
        .subscribe(params1 => {
          if (Object.keys(params1).length > 0) {
            this.currentPage = params1[Object.keys(params1)[0]];
          }
        });
      this._coordinateService.getById(params.id).then(resp => {
        this.usersData = resp.data;
        this.coordinatorEditForm.patchValue(resp.data);
        this.spinner.hide();
      }).catch(err => {
      });
    });
  }

  save(data) {
    this.spinner.show();
    if (!this.coordinatorEditForm.valid) {
      Object.keys(this.coordinatorEditForm.controls).forEach(key => {
        this.coordinatorEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this._coordinateService.save(data, this.extra).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Co-Ordinator updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/coordinator/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
