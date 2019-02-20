import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OpportunityService, OpportunityItem } from '../opportunity.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services/login/login.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  viewData: OpportunityItem;
  allItems: any[];
  allVerifiedItems: any[];
  rowsTemp: any[];
  pager: any = {};
  currentPage = 1;
  onAwardedChangeFlag: boolean;
  onResponseChangeFlag: boolean;

  constructor(
    private router: Router,
    private _activeroute: ActivatedRoute,
    private opportunityService: OpportunityService,
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
    this.onAwardedChangeFlag = false;
    this.onResponseChangeFlag = false;
    this.rowsTemp = [];
  }

  ngOnInit() {
    this._activeroute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.currentPage = Number(params[Object.keys(params)[0]]);
        }
        this.getData();
      });
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

  getColor(response: string, awarded: string) {
    return response ? '#00B645 !important' : awarded ? '#009473 !important' : 'transparent !important';
  }

  getData(currentPage?: number) {
    this.spinner.show();
    this.opportunityService.getData().then(resp => {
      this._loginService.filterData(resp, 'data', 'created_by').then(filtered => {
        this.allItems = filtered;
        this.getDataByPage(currentPage || this.currentPage);
        this.spinner.hide();
      });
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
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/opportunity/edit/' + id], { queryParams: { page: this.currentPage } });
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.opportunityService.delete(id).then(() => {
      this.getData(this.currentPage);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  onReject() { this._messageService.clear('c'); }

  delete(id) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

}
