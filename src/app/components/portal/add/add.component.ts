import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { PortalService } from '../portal.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  portalAddForm: FormGroup;
  formInvalid: boolean;

  constructor(
    private router: Router,
    private portalService: PortalService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.portalAddForm = new FormGroup({
      portalName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  save(data) {
    this.spinner.show();
    if (!this.portalAddForm.valid) {
      Object.keys(this.portalAddForm.controls).forEach(key => {
        this.portalAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.portalService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Portal added successfully' });
        setTimeout(() => {
          this.router.navigate(['app/portal/list']);
        }, 2000);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
