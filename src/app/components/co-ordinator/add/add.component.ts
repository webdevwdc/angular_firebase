import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CoOrdinatorService } from '../co-ordinator.service';

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

  coordinatorAddForm: FormGroup;
  formInvalid: boolean;
  // categories: any = [];
  // managers: any = [];
  dialog_display = false;
  userPassword = '';
  // managerCheckBox = true;
  res: any;

  constructor(
    private router: Router,
    private _coordinateService: CoOrdinatorService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _angular_authservice: AngularFireAuth,
    private authService: AuthService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.coordinatorAddForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() {
  }

  submit_popup() {
    if (this.userPassword !== '') {
      this._coordinateService.setSuperadminCredential(true);
    } else {
      this._coordinateService.setSuperadminCredential(false);
    }
    this.dialog_display = false;
  }

  cancel_popup() {
    this._coordinateService.setSuperadminCredential(false);
    this.dialog_display = false;
  }

  save(data) {
    if (!this.coordinatorAddForm.valid) {
      Object.keys(this.coordinatorAddForm.controls).forEach(key => {
        this.coordinatorAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.dialog_display = true;
      this._coordinateService.getSuperadminCredential()
        .pipe(
          take(1)
        )
        .subscribe(res => {
          if (res) {
            data['role'] = ['coordinator'];
            this.spinner.show();
            const credential = firebase.auth.EmailAuthProvider.credential(
              firebase.auth().currentUser.email, this.userPassword
            );
            firebase.auth().currentUser.reauthenticateWithCredential(
              credential
            ).then(_ => this.authService.doRegister(data))
              .then(res1 => this._coordinateService.save(data, res1.user.uid))
              .then(_ => {
                this.spinner.hide();
                this._messageService.add({ severity: 'success', summary: 'Success', detail: 'CoOrdinator added successfully' });
                return this._angular_authservice.auth.signInAndRetrieveDataWithCredential(credential);
              })
              .then(_ => {
                this.router.navigate(['app/coordinator/list']);
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
