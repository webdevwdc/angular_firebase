import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../profile.service';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  profileAddForm: FormGroup;
  formInvalid: boolean;
  portals: any;


  constructor(
    private _router: Router,
    private profileService: ProfileService,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.profileAddForm = new FormGroup({
      portal: new FormControl('', [Validators.required]),
      profileName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9_\s-]+$/)]),

    });
  }

  ngOnInit() {

    this.profileService.getAllPortal().then(res => {
      this.portals = res;
    }).catch(error => {
      this._spinner.hide();
    });
  }

  profileAddFormSubmit() {
    this._spinner.show();
    if (!this.profileAddForm.valid) {
      this._spinner.hide();
      Object.keys(this.profileAddForm.controls).forEach(key => {
        this.profileAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.profileService.save(this.profileAddForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile added successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/profile']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
