import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PortalService, PortalItem } from '../portal.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  viewData: PortalItem;
  currentPage = 1;
  allItems: any[];
  pager: any = {};
  searchText: string;

  constructor(
    private router: Router,
    private _activeroute: ActivatedRoute,
    private portalService: PortalService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
  ) {
    this.display = false;
    this.viewData = {
      portalName: '',
      status: '',
      insertedAt: new Date,
      isDeleted: false,
    };
  }

  ngOnInit() {
    this._activeroute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.currentPage = Number(params[Object.keys(params)[0]]);
        }
      });
    this.getAllPortal();
  }

  getAllPortal(currentPage?: number) {
    this.spinner.show();
    this.portalService.getData().then(resp => {
      this.allItems = resp;
      this.getDataByPage(currentPage || this.currentPage);
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  view(id) {
    this.portalService.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/portal/edit/' + id], { queryParams: { page: this.currentPage } });
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.portalService.delete(id).then(() => {
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
      this.getAllPortal(this.currentPage);
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
