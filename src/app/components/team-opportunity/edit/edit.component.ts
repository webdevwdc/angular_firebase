import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { TeamOpportunityService } from '../team-opportunity.service';
import { LoginService } from '../../../core/services';
import { OpportunityService } from '../../opportunity/opportunity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  teamOpportunityEditForm: FormGroup;
  formInvalid: boolean;
  associates: any;
  currentPage;
  currentUser: any;
  associate: any;
  allAssociate: any[];
  allAssociates: any[];
  checkbox: string[] = [];
  show = false;
  closerDisplay: boolean;
  closers: Array<any>;
  superadmin: any;
  managerId: any;
  managerAssociate: any;

  constructor(
    private _router: Router,
    private ac: ActivatedRoute,
    private teamOpportunityService: TeamOpportunityService,
    private Opportunityservice: OpportunityService,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.teamOpportunityEditForm = new FormGroup({
      created_by: new FormControl(''),
      closer_name: new FormControl(''),
      response: new FormControl([]),
      awarded: new FormControl([]),
    });
    this.closerDisplay = false;
    this.closers = [];

    this._loginService.currentUser()
      .then(user => {
        this.teamOpportunityService.getSuperadmin().then(admin => {
          if (user['role'].indexOf('manager') > -1 || user['role'].indexOf('superadmin') > -1) {
            this.closerDisplay = true;
          } else if (user['role'].indexOf('superadmin') > -1) {
            this.superadmin = admin[0].id;

          }
        });
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

      this._loginService.currentUser().then(current_user => {
        this.teamOpportunityService.getAllAssociate(current_user['id']).then(allAssociate => {
          this.teamOpportunityService.getAllAssociates().then(allAssociates => {

            this.allAssociate = allAssociate;
            this.allAssociates = allAssociates;

            if (current_user['role'].indexOf('manager') > -1) {
              this.allAssociate = allAssociate.filter(item => {
                if (item['id'] !== params.associate_id) {
                  return item;
                }
              });
            } else if (current_user['role'].indexOf('superadmin') > -1) {
              this.allAssociate = allAssociates.filter(item => {
                if (item['id'] !== params.associate_id) {
                  return item;
                }
                this.managerId = item.data.manager;
              });
              this.allAssociate = allAssociates.filter(item2 => {

                if ((item2['data']['manager'] === this.managerId) && (item2['id'] !== params.associate_id)) {
                  return item2;
                }

              });
            }

            if (current_user['role'].indexOf('manager') > -1) {
              this.associate = allAssociate.filter(item => {
                if (item['id'] === params.associate_id) {
                  return item;
                }
              });
            } else if (current_user['role'].indexOf('superadmin') > -1) {
              this.associate = allAssociates.filter(item => {
                if (item['id'] === params.associate_id) {
                  return item;
                }
              });
            }

          });

        });

      }).catch(error => {
        this._spinner.hide();
      }).catch(error => {
        this._spinner.hide();
      }).catch(error => {
        this._spinner.hide();
      });
    });
  }

  onChange() {
    const latestCheck = this.checkbox[this.checkbox.length - 1];
    const closerControl = this.teamOpportunityEditForm.get('closer_name');
    this.checkbox.length = 0;
    this.checkbox.push(latestCheck);
    this.getAllCloser();
    if (latestCheck === 'response' || latestCheck === 'awarded') {
      this.show = true;
      closerControl.setValidators([Validators.required]);
    } else {
      this.show = false;
      closerControl.clearValidators();
    }
    closerControl.updateValueAndValidity();

  }

  getAllCloser() {
    this._spinner.show();
    this.Opportunityservice.getAllClosers().then(res => {
      this.closers = res;
      this._spinner.hide();
    }).catch(_ => {
      this._spinner.hide();
    });
  }

  save(data) {
    this._spinner.show();
    if (!this.teamOpportunityEditForm.valid) {
      Object.keys(this.teamOpportunityEditForm.controls).forEach(key => {
        this.teamOpportunityEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      data['prev_associate'] = this.associate[0]['id'];
      // data['new_note'] = { 'message': 'hello' };
      this.teamOpportunityService.save(data).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Associate Changed successfully' });
        setTimeout(() => {
          this._router.navigate(['app/team-opportunity/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
