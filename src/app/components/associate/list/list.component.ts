import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssociateService } from '../associate.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';
import { hasIn } from 'lodash';


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
  pager: any = {};
  currentPage = 1;

  constructor(
    private router: Router,
    private _activeroute: ActivatedRoute,
    private associateService: AssociateService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
  ) {
    this.display = false;
  }

  ngOnInit() {
    this._activeroute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.currentPage = Number(params[Object.keys(params)[0]]);
        }
      });
    this.getData();
  }

  getData(currentPage?: number) {
    this.spinner.show();
    this.associateService.getAll().then(resp => {
      this.allItems = resp;
      this.getDataByPage(currentPage || this.currentPage);
      this.spinner.hide();
    }).catch(_ => {
      this.spinner.hide();
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  view(id) {
    this.associateService.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    })
      .catch(_ => {
        this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
      });
  }

  goToEdit(id) {
    this.router.navigate(['app/associate/edit/' + id], { queryParams: { page: this.currentPage } });
  }

  showShift(id) {
    this.router.navigate(['app/shift/myshift/' + id], { queryParams: { page: this.currentPage } });
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.associateService.delete(id).then(() => {
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
      this.getData(this.currentPage);
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  onReject() { this._messageService.clear('c'); }

  delete(id, uid) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

}
