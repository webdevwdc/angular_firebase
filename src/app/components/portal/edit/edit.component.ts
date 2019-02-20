import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { PortalService } from '../portal.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  portalEditForm: FormGroup;
  formInvalid: boolean;
  currentPage: Number;

  constructor(
    private portalService: PortalService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.portalEditForm = new FormGroup({
      portalName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
      status: new FormControl('', [Validators.required])

    });
  }

  ngOnInit() {
    this.ac.params.subscribe(params => {
      this.ac.queryParams
        .subscribe(query_params => {
          if (Object.keys(params).length > 0) {
            this.currentPage = params[Object.keys(query_params)[0]];
          }
        });

      this.portalService.getById(params.id).then(resp => {
        this.portalEditForm.patchValue({
          id: params.id,
        });
        this.portalEditForm.patchValue(resp.data);
      }).catch(err => {
      });
    });
  }

  save(data) {
    this.spinner.show();
    if (!this.portalEditForm.valid) {
      Object.keys(this.portalEditForm.controls).forEach(key => {
        this.portalEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this.portalService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Portal updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/portal/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
