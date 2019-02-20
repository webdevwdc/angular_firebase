import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AssociateService } from '../associate.service';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService, LoginService } from '../../../core/services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  associateAddForm: FormGroup;
  formInvalid: boolean;
  categories: any = [];
  managers: any = [];
  dialog_display = false;
  userPassword = '';
  managerCheckBox = false;
  CoOrdinatorCheckBox = false;
  res: any;

  constructor(
    private router: Router,
    private associateService: AssociateService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _angular_authservice: AngularFireAuth,
    private authService: AuthService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.associateAddForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      phoneNumber: new FormControl('', [Validators.required]),
      isManager: new FormControl(false),
      isCloser: new FormControl(false),
      isCoOrdinator: new FormControl(false),
      manager: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() {
    this.getAllManager();
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
    this.managerCheckBox = this.associateAddForm.controls['isManager'].value;
    const managerControl = this.associateAddForm.get('manager');
    if (this.managerCheckBox === true) {
      managerControl.clearValidators();
    } else {
      managerControl.setValidators([Validators.required]);
    }
    managerControl.updateValueAndValidity();
  }


  coOrdinatorChange() {
    this.CoOrdinatorCheckBox = this.associateAddForm.controls['isCoOrdinator'].value;
  }

  submit_popup() {
    if (this.userPassword !== '') {
      this.associateService.setSuperadminCredential(true);
    } else {
      this.associateService.setSuperadminCredential(false);
    }
    this.dialog_display = false;
  }

  cancel_popup() {
    this.associateService.setSuperadminCredential(false);
    this.dialog_display = false;
  }

  save(data) {
    if (!this.associateAddForm.valid) {
      Object.keys(this.associateAddForm.controls).forEach(key => {
        this.associateAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.dialog_display = true;
      this.associateService.getSuperadminCredential()
        .pipe(
          take(1)
        )
        .subscribe(res => {
          if (res) {
            if (this.managerCheckBox) {
              data['role'] = ['manager'];
            } else {
              data['role'] = ['associate'];
            }
            if (this.CoOrdinatorCheckBox) {
              data['role'] = ['coordinator'];
            }
            this.spinner.show();
            const credential = firebase.auth.EmailAuthProvider.credential(
              firebase.auth().currentUser.email, this.userPassword
            );
            firebase.auth().currentUser.reauthenticateWithCredential(
              credential
            ).then(_ => this.authService.doRegister(data))
              .then(res1 => this.associateService.save(data, res1.user.uid))
              .then(_ => {
                this.spinner.hide();
                this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Associate added successfully' });
                return this._angular_authservice.auth.signInAndRetrieveDataWithCredential(credential);
              })
              .then(_ => {
                this.router.navigate(['app/associate/list']);
              }).catch(err => {
                this.spinner.hide();
                this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
              });
          } else {
            this.dialog_display = res;
          }
        });
    }
  }

}
