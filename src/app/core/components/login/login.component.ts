import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { APP_CONFIG } from '../../../app.config';
import { MessageService } from 'primeng/api';

import { AngularFireAuth } from '@angular/fire/auth';
import { CookieService } from 'angular2-cookie/core';
import * as CryptoJS from 'crypto-js';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showSpinner: boolean;
  formInvalid: boolean;
  resetEmail: string;
  display1: boolean;
  previousUrl: string = undefined;
  rememberme: any;
  constructor(
    @Inject(APP_CONFIG) private config: any,
    private router: Router,
    private _messageService: MessageService,
    private _service: LoginService,
    private spinner: NgxSpinnerService,
    private angularAuth: AngularFireAuth,
    private _cookieService: CookieService
  ) {
    this.formInvalid = true;
    this.showSpinner = false;
    this.display1 = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(this.config.PASSWORD_MIN_LENGTH), Validators.maxLength(this.config.PASSWORD_MAX_LENGTH)
      ]),
    });
  }

  ngOnInit() {
    if (this._service.isLoggedin() && this._service.getPreviousUrl()) {
      this.router.navigateByUrl(this._service.getPreviousUrl());
    }
    if (this._service.isLoggedin()) {
      this.router.navigateByUrl(this._service.getPreviousUrl());
    }
    this.setRememberMe();
    this._rememberMe();
  }

  setRememberMe() {
    this.rememberme = this._cookieService.get('r');
    if (this.rememberme === 'true') {
      const d_email = CryptoJS.AES.decrypt(this._cookieService.get('u'), 'u');
      const d_pass = CryptoJS.AES.decrypt(this._cookieService.get('p'), 'p');
      this.loginForm.patchValue({
        email: d_email.toString(CryptoJS.enc.Utf8),
        password: d_pass.toString(CryptoJS.enc.Utf8)
      });
    }
  }

  _rememberMe() {
    if (this.rememberme === true) {
      const user = CryptoJS.AES.encrypt(this.loginForm.controls.email.value, 'u');
      const pwd = CryptoJS.AES.encrypt(this.loginForm.controls.password.value, 'p');
      this._cookieService.put('u', user);
      this._cookieService.put('p', pwd);
      this._cookieService.put('r', this.rememberme);
    } else {
      this._cookieService.remove('u');
      this._cookieService.remove('p');
      this._cookieService.remove('r');
    }
  }

  showDialog() {
    this.display1 = true;
  }

  login(value): void {
    this._service.login(value.email,
      value.password).then(
        data => {
          this.angularAuth.auth.currentUser.getIdToken()
            .then(
              token => {
                sessionStorage.setItem('_uid', data['uid']);
                sessionStorage.setItem('_email', data['email']);
                sessionStorage.setItem('_token', token);
                if (token) {
                  if (this.rememberme === 'true' || this.rememberme === true) {
                    this._rememberMe();
                    // this.spinner.hide();
                  } else {
                    this._cookieService.remove('u');
                    this._cookieService.remove('p');
                    this._cookieService.remove('r');
                  }

                  if (data['role'].indexOf('superadmin') > -1) {
                    this.router.navigateByUrl('/app/category');
                  } else if (data['role'].indexOf('associate') > -1) {
                    this.router.navigateByUrl('/app/shift/myshift/' + data['id']);
                  } else {
                    this.router.navigateByUrl('/app/shift');
                  }
                  this.spinner.hide();
                }
              });
          // });
        },
        error => {
          this.spinner.hide();
          this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
        });
  }


  loginFormSubmit() {
    this.spinner.show();
    if (!this.loginForm.valid) {
      this.spinner.hide();
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.login(this.loginForm.value);

      this.formInvalid = false;
    }
  }

  forgetPass() {
    this.spinner.show();
    this._service.forgetPassword(this.resetEmail).then(res => {
      this.spinner.hide();
      this._messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      this.display1 = false;
    }).catch(err => {
      this.spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
  }
}
