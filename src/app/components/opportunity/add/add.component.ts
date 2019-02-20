import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OpportunityService } from '../opportunity.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/core/services';
import { TeamOpportunityService } from '../../team-opportunity/team-opportunity.service';
import { ComponentsModule } from '../../components.module';

@Component({
  selector: 'app-opportunity-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  opportunityForm: FormGroup;
  categories: Array<any>;
  portals: Array<any>;
  profiles: Array<any>;
  projectTypes: Array<any>;
  verifiedBy: Array<any>;
  displayProposed: boolean;
  shouldShowCreatedBy: boolean;
  currentUser: any;
  currentPage;
  associateData: any;
  associate: any;
  associates: any;
  managers: any[];
  checkbox: string[] = [];


  constructor(
    private ac: ActivatedRoute,
    private _fb: FormBuilder,
    private _service: OpportunityService,
    private teamOpportunityService: TeamOpportunityService,
    private _messageService: MessageService,
    private _spinner: NgxSpinnerService,
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
      response: new FormControl(false, []),
      awarded: new FormControl(false, []),
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
      created_by: new FormControl('', []),
    });
    this.categories = [];
    this.portals = [];
    this.profiles = [];
    this.projectTypes = [];
    this.verifiedBy = [];
    this.displayProposed = true;
    this.shouldShowCreatedBy = false;

    this._loginService.currentUser()
      .then(user => {
        let createdBy = null;
        if (user['role'].indexOf('manager') > -1 || user['role'].indexOf('superadmin') > -1) {
          createdBy = user['id'];
        } else if (user['role'].indexOf('associate') > -1) {
          createdBy = user['id'];
          this.shouldShowCreatedBy = true;
        }

        this.opportunityForm.patchValue({
          created_by: createdBy
        });
      });
  }

  ngOnInit() {
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
        this._loginService.currentUser().then(user => {
          this._service.getAllAssociate().then(associates => {
            this._service.getManager().then(manager => {
              const managers = manager;
              if (user['role'].indexOf('associate') > -1) {
                this.associateData = associates.filter(item1 => {
                  if (item1['id'] === user['id']) {
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

      });
    this.onChange();
  }

  onChange() {
    const latestCheck = this.checkbox[this.checkbox.length - 1];
    this.checkbox.length = 0;
    this.checkbox.push(latestCheck);
  }

  onChangeProjectType(ev: any) {
    const getProjectTypes = this.projectTypes.filter(item => item.id === ev.target.value);
    if (getProjectTypes.length) {
      this.displayProposed = getProjectTypes[0].data.isTimeRequired;
    }
    ev.preventDefault();
  }

  submit(data) {
    this._spinner.show();
    if (!this.opportunityForm.valid) {
      this._spinner.hide();
      Object.keys(this.opportunityForm.controls).forEach(key => {
        this.opportunityForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this._service.save(this.opportunityForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Opportunity added successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/opportunity/list']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }
}
