import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from 'src/app/services/pager/pager.service';
import { LoginService } from 'src/app/core/services';
import { OpportunityService, OpportunityItem } from '../../opportunity/opportunity.service';
import { TeamOpportunityService } from '../../team-opportunity/team-opportunity.service';


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
  allVerifiedItems: any[];
  rowsTemp: any[];
  pager: any = {};
  currentPage = 1;
  currentUser: any;



  constructor(
    private router: Router,
    private _activeroute: ActivatedRoute,
    private opportunityService: OpportunityService,
    private teamOpportunityService: TeamOpportunityService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService
  ) {
    this.display = false;
    this.viewData = {
      category: '',
      jobTitle: '',
      portal: '',
      profile: '',
      project: '',
      status: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.rowsTemp = [];
  }

  ngOnInit() {
    this.spinner.show();
    this._activeroute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          if (Object.keys(params).length > 0) {
            this.currentPage = Number(params[Object.keys(params)[0]]);
          }
        }
        this.getData();
      }, error => {
        this.spinner.hide();
      });
  }


  getColor(response: string, awarded: string) {
    return response ? '#00B645 !important' : awarded ? '#009473 !important' : 'transparent !important';
  }

  getData(currentPage?: number) {
    this.spinner.show();
    this.opportunityService.getDataClosedProject().then(resp => {
      this.allItems = resp;
      // console.log(this.allItems);
      this.getDataByPage(currentPage || this.currentPage);
      this.spinner.hide();
      // });
    }).catch(_ => {
      this.spinner.hide();
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rowsTemp = this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
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
      .catch(() => {
        this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
      });
  }

}
