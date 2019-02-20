import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { TeamOpportunityService, FilterData } from '../team-opportunity.service';
import { SearchFilterPipe } from 'src/app/core/pipe/filter.pipe';
import { Key } from 'protractor';
import * as moment from 'moment';
import { AssociateService } from '../../associate/associate.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  viewData: any;
  allItems: any[];
  createdBy: any[];
  pager: any = {};
  currentPage = 1;
  associates: Array<object>;
  allAssociates: Array<object>;
  associateId: any = '';
  portals: Array<object>;
  portalId: any = '';
  profiles: Array<object>;
  profileId: any = '';
  currentUser: any;
  userId: any;
  verifiedID: any;
  creadedId: any;
  associateUid: any;
  rowsTemp: any[];
  fiteredArr = [];
  onAwardedChangeFlag: boolean;
  onResponseChangeFlag: boolean;
  calendar: Date;
  _moment: any;
  date: any;
  selectedDate: any;
  dates: any = [];
  associate: any;
  Opportunitydata: any;



  constructor(
    private router: Router,
    private _activeroute: ActivatedRoute,
    private opportunityService: OpportunityService,
    private teamOpportunityService: TeamOpportunityService,
    private associateService: AssociateService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
    public datepipe: DatePipe

  ) {
    this.display = false;
    this.viewData = {
      category: '',
      job_title: '',
      portalName: '',
      profileName: '',
      project_type: '',
      status: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.associates = [];
    this.portals = [];
    this.profiles = [];

    this.rowsTemp = [];
    this.onAwardedChangeFlag = false;
    this.onResponseChangeFlag = false;

  }

  ngOnInit() {
    this.spinner.show();
    this._activeroute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.associateId = params[Object.keys(params)[0]];
          this.portalId = params[Object.keys(params)[0]];
          this.profileId = params[Object.keys(params)[0]];

          if (Object.keys(params).length > 0) {
            this.currentPage = Number(params[Object.keys(params)[0]]);
          }
        }
        this._loginService.currentUser().then(current_user => {
          this.currentUser = current_user;
          this.teamOpportunityService.getAllAssociate(current_user['id']).then(associates => {
            this.teamOpportunityService.getAllAssociates().then(allAssociates => {
              this.teamOpportunityService.getAllPortal().then(portals => {
                this.teamOpportunityService.getAllProfile().then(profiles => {
                  this.allAssociates = allAssociates;
                  this.associates = associates;
                  this.portals = portals;
                  this.profiles = profiles;

                  this.associates = associates.filter(item => {
                    if (item['id'] !== params.associate_id) {
                      return item;
                    }
                  });

                  if (current_user['role'].indexOf('superadmin') > -1) {
                    this.associates = this.allAssociates;
                  }

                }).catch(_ => {
                  this.spinner.hide();
                });
              }).catch(_ => {
                this.spinner.hide();
              }).catch(_ => {
                this.spinner.hide();
              }).catch(_ => {
                this.spinner.hide();
              });
            });
          });
        });

        this.getData();
      }, error => {
        this.spinner.hide();
      });
  }

  changeAssociate(value) {
    this.spinner.show();
    this.associateId = value;
    this.getData({
      key: 'created_by',
      val: value
    }, this.currentPage);
    this.spinner.hide();

  }

  changePortal(value) {
    this.spinner.show();
    this.portalId = value;
    this.getData({
      key: 'portal',
      val: value
    }, this.currentPage);
    this.spinner.hide();
  }

  changeProfile(value) {
    this.spinner.show();
    this.profileId = value;
    this.getData({
      key: 'profile',
      val: value
    }, this.currentPage
    );
    this.spinner.hide();

  }

  onDateSelected(value: any) {
    const selectedDate = value !== undefined ? moment(value).format('YYYY-MM-DD') : '';
    // console.log(selectedDate);
    this.getDatabyselectedDate(selectedDate,
      this.currentPage);
  }


  onAwardedChange() {
    this.rows = this.rowsTemp.filter(item => item.data.awarded === this.onAwardedChangeFlag);
    this.checkAwardedAndResponseFlag();
  }

  onResponseChange() {
    this.rows = this.rowsTemp.filter(item => item.data.response === this.onResponseChangeFlag);
    this.checkAwardedAndResponseFlag();
  }

  checkAwardedAndResponseFlag() {
    if (!this.onAwardedChangeFlag && !this.onResponseChangeFlag) {
      this.rows = this.rowsTemp;
    }
  }


  getData(value?: FilterData, currentPage?: number) {
    this.spinner.show();
    this.associateService.getAllAssociate().then(res1 => {
      this._loginService.currentUser().then(current_user => {
        this.currentUser = current_user;
        this.teamOpportunityService.getData(value, current_user['id']).then(resp => {
          this._loginService.filterData(resp, 'data', 'verified_by').then(filtered => {
            const Opportunitydata = filtered;
            this.Opportunitydata = Opportunitydata.filter(item => {
              if (res1.length > 0) {
                if (item['data']['created_by'] === res1[0].id) {
                  return item;
                }
              }
            });
            this.allItems = filtered;
            this.getDataByPage(currentPage || this.currentPage);
            this.spinner.hide();
          });
        }).catch(_ => {
          this.spinner.hide();
        });
      });
    });
  }


  getDatabyselectedDate(selectedDate, currentPage?: number) {
    // console.log(selectedDate);
    this._loginService.currentUser().then(current_user => {
      this.currentUser = current_user;
      this.teamOpportunityService.getDataWithDate(selectedDate, current_user['id']).then(resp => {
        this._loginService.filterData(resp, 'data', 'verified_by').then(filteredt => {
          const dates = filteredt;
          this.dates = dates.filter(item => {
            if (item['data']['created_date'] === selectedDate) {
              return item;
            } else {
              return false;
            }

          });
          this.allItems = this.dates;
          this.getDataByPage(currentPage || this.currentPage);
          this.spinner.hide();
        }).catch(_ => {
          this.spinner.hide();
        });
      }).catch(_ => {
        this.spinner.hide();
      });
    }).catch(_ => {
      this.spinner.hide();
    });
  }


  view(id) {
    this.opportunityService.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
      return Promise.all([
        this.opportunityService.getCategoryById(this.viewData['category']),
        this.opportunityService.getProfileById(this.viewData['profile']),
        this.opportunityService.getPortalById(this.viewData['portal']),
        this.opportunityService.getProjectTypeById(this.viewData['project_type']),

      ]);
    })
      .then(resp => {
        if (resp[0]['data']) {
          this.viewData['category_name'] = resp[0]['data']['categoryName'];
        }
        if (resp[1]['data']) {
          this.viewData['profile_name'] = resp[1]['data']['profileName'];
        }
        if (resp[2]['data']) {
          this.viewData['portal_name'] = resp[2]['data']['portalName'];
        }
        if (resp[3]['data']) {
          this.viewData['projectType_name'] = resp[3]['data']['name'];
        }
      })
      .catch(_ => {
        this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
      });
  }



  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  goToEdit(id) {
    this.router.navigate(['app/team-opportunity/edit/' + id], { queryParams: { page: this.currentPage } });
  }

  onReject() { this._messageService.clear('c'); }

}
