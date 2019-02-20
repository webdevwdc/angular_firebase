import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  profileEditForm: FormGroup;
  portals: any;
  currentPage: number;
  editedID: any;


  constructor(
    private profileService: ProfileService,
    private ac: ActivatedRoute,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.profileEditForm = new FormGroup({
      portal: new FormControl('', [Validators.required]),
      profileName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9_\s-]+$/)]),
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

      this.editedID = params['id'];
      this.profileService.getById(this.editedID).then(resp => {
        this.profileEditForm.patchValue(resp.data);
      }).catch(err => {
      });
    });
    this.profileService.getAllPortal().then(res => {
      this.portals = res;
    }).catch(error => {
      this._spinner.hide();
    });
  }

  profileEditFormSubmit() {
    this._spinner.show();
    if (!this.profileEditForm.valid) {
      this._spinner.hide();
      Object.keys(this.profileEditForm.controls).forEach(key => {
        this.profileEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.profileEditForm.value['id'] = this.editedID;
      this.profileService.save(this.profileEditForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile Updated successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/profile'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
