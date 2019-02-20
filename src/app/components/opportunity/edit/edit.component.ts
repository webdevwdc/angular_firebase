import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OpportunityService } from '../opportunity.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/core/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editedID: any;
  currentPage;
  opportunityForm: FormGroup;
  categories: Array<any>;
  portals: Array<any>;
  profiles: Array<any>;
  projectTypes: Array<any>;
  verifiedBy: Array<any>;
  closers: Array<any>;
  displayProposed: boolean;
  shouldShowCreatedBy: boolean;
  closerDisplay: boolean;
  currentUser: any;
  allAssociate: any[];
  managers: any;
  associates: any;
  checkbox: string[] = [];
  show = false;
  associateData: any;

  constructor(
    private _fb: FormBuilder,
    private _service: OpportunityService,
    private _messageService: MessageService,
    private _spinner: NgxSpinnerService,
    private ac: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService,
  ) {
    this.opportunityForm = this._fb.group({
      link: new FormControl('', [
        Validators.required,
        Validators.pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
      ]),
      job_title: new FormControl('', [Validators.required]),
      verification: new FormControl(true, []),
      verified_by: new FormControl('', []),
      response: new FormControl([]),
      awarded: new FormControl([]),
      category: new FormControl('', [Validators.required]),
      portal: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      project_type: new FormControl('', [Validators.required]),
      closer_name: new FormControl(''),
      proposed_pricing: new FormControl('0', [
        Validators.pattern(/^\d*$/),
      ]),
      proposed_hour: new FormControl(0, [
        Validators.pattern(/\b2[0-3]\b|\b[0-1]?[0-9]\b/)
      ]),
    });
    this.categories = [];
    this.portals = [];
    this.profiles = [];
    this.projectTypes = [];
    this.verifiedBy = [];
    this.closers = [];
    this.displayProposed = true;
    this.shouldShowCreatedBy = false;
    this.closerDisplay = false;

    this._loginService.currentUser()
      .then(user => {
        if (user['role'].indexOf('associate') > -1) {
          this.shouldShowCreatedBy = true;
        } else if (user['role'].indexOf('manager') > -1 || user['role'].indexOf('superadmin') > -1) {
          this.closerDisplay = true;
        }
      });
  }

  ngOnInit() {
    this._spinner.show();
    this.ac.params.subscribe(params => {
      this.ac.queryParams
        .subscribe(params1 => {
          if (Object.keys(params1).length > 0) {
            this.currentPage = params1[Object.keys(params)[0]];
          }
        });

      this.editedID = params['id'];
      this._service.getById(this.editedID).then(response => {
        this.opportunityForm.patchValue(response.data);
        this._spinner.hide();
      }).catch(_ => {
        this._spinner.hide();
      });
    });
    this.ac.queryParams
      .subscribe(params => {
        (async () => {
          try {
            this.categories = await this._service.getCategories();
            this.portals = await this._service.getProtrals();
            this.profiles = await this._service.getProfiles();
            this.projectTypes = await this._service.getProjectTypes();
            this.verifiedBy = await this.managers;
          } catch (error) {
            // TODO: show error
          }
        })();

        this._loginService.currentUser().then(current_user => {
          this.currentUser = current_user;
          this._service.getAllAssociate().then(associates => {
            this._service.getManager().then(manager => {

              const managers = manager;
              if (current_user['role'].indexOf('associate') > -1) {
                this.associateData = associates.filter(item1 => {
                  if (item1['id'] === current_user['id']) {
                    return item1;
                  }
                  this.associateData = item1;
                });
                this.managers = managers.filter(item => {
                  if (item['id'] === this.associateData[0].data.manager) {
                    return item['data']['firstName'] + '' + item['data']['lastName'];
                  }
                });
                this.verifiedBy = this.managers;
              }
              this.associates = associates.filter(item => {
                if (item['id'] !== params.associate_id) {
                  return item;
                }
              });
            }).catch(_ => {
              this._spinner.hide();
            });
          }).catch(_ => {
            this._spinner.hide();
          }).catch(_ => {
            this._spinner.hide();
          }).catch(_ => {
            this._spinner.hide();
          });
        }, error => {
          this._spinner.hide();
        });
      });
    // this.getAllCloser();

  }

  onChange() {
    const latestCheck = this.checkbox[this.checkbox.length - 1];
    const closerControl = this.opportunityForm.get('closer_name');
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
    this._service.getAllClosers().then(res => {
      this.closers = res;
      this._spinner.hide();
    }).catch(_ => {
      this._spinner.hide();
    });
  }
  onChangeProjectType(ev: any) {
    const getProjectTypes = this.projectTypes.filter(item => item.id === ev.target.value);
    if (getProjectTypes.length) {
      this.displayProposed = getProjectTypes[0].data.isTimeRequired;
    }
    ev.preventDefault();
  }

  submit() {
    this._spinner.show();
    if (!this.opportunityForm.valid) {
      this._spinner.hide();
      Object.keys(this.opportunityForm.controls).forEach(key => {
        this.opportunityForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.opportunityForm.value['id'] = this.editedID;
      this._service.save(this.opportunityForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Opportunity updated successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/opportunity/list'], { queryParams: { page: this.currentPage } });
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
