import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { AssociateService } from '../associate.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../core/services';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  associateEditForm: FormGroup;
  formInvalid: boolean;
  managers: any = [];
  extra: any;
  currentPage: number;
  managerCheckBox = true;
  CoOrdinatorCheckBox = false;
  usersData: any;
  filterManager: any;

  constructor(
    public associateService: AssociateService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.associateEditForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      phoneNumber: new FormControl('', [Validators.required]),
      isManager: new FormControl(),
      isCloser: new FormControl(false),
      isCoOrdinator: new FormControl(false),
      manager: new FormControl(''),
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
      this.associateService.getById(params.id).then(resp => {
        this.usersData = resp.data;
        this.associateEditForm.patchValue(resp.data);
        this.spinner.hide();
        if (resp.data.isManager === false) {
          this.getAllManager();
          this.managerCheckBox = false;
          this.onchange();
        }

        if (this.usersData.isCoOrdinator === true) {
          this.CoOrdinatorCheckBox = true;
        } else {
          this.CoOrdinatorCheckBox = false;
        }
        this.getAllManager();

      }).catch(err => {
      });
    });

  }


  getAllManager() {
    this.spinner.show();
    this.associateService.getAllManager().then(res => {
      this.managers = res;
      this.spinner.hide();
    }).catch(_ => {
      this.spinner.hide();
    });
  }

  onchange() {
    this.managerCheckBox = this.associateEditForm.controls['isManager'].value;
    const managerControl = this.associateEditForm.get('manager');
    if (this.managerCheckBox === true) {
      managerControl.clearValidators();
    } else {
      managerControl.setValidators([Validators.required]);
    }
    managerControl.updateValueAndValidity();
  }

  coOrdinatorChange() {
    this.CoOrdinatorCheckBox = this.associateEditForm.controls['isCoOrdinator'].value;
    const managerControl = this.associateEditForm.get('manager');

    if (this.CoOrdinatorCheckBox === true) {
      managerControl.clearValidators();
    } else {
      managerControl.setValidators([Validators.required]);
    }
    managerControl.updateValueAndValidity();
  }

  save(data) {
    this.spinner.show();
    if (!this.associateEditForm.valid) {
      Object.keys(this.associateEditForm.controls).forEach(key => {
        this.associateEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      if (data['isManager']) {
        data['role'] = ['manager'];
        data['manager'] = '';
      } else {
        data['role'] = ['associate'];
      }
      if (data['isCoOrdinator']) {
        data['role'] = ['coordinator'];
      }
      this.associateService.save(data, this.extra).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Associate updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/associate/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
