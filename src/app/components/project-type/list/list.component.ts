import { Component, OnInit } from '@angular/core';
import { ProjectTypeService } from '../project-type.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from 'src/app/services/pager/pager.service';

@Component({
  selector: 'app-project-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  rowdata: any;
  allItems: any[];
  pager: any = {};
  viewData: any;
  currentPage = 1;
  searchText: string;

  constructor(
    private _service: ProjectTypeService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private ac: ActivatedRoute
    , private _pagerService: PagerService
  ) {
    this.display = false;
    this.viewData = {
      color: '',
      code: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.searchText = '';
  }

  ngOnInit() {
    this.display = false;
    this.ac.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.currentPage = Number(params[Object.keys(params)[0]]);
        }
      });
    this.getViewData();
  }

  getViewData(currentPage?: number) {
    this._spinner.show();
    this._service.getData().then(res => {
      this.allItems = res;
      this.getDataByPage(currentPage || this.currentPage);
      this._spinner.hide();
    }).catch(_ => {
      this._spinner.hide();
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  view(id) {
    this._service.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this._router.navigate(['app/project-type/edit/' + id], { queryParams: { page: this.currentPage } });
  }

  showDialog(rowData: any) {
    this.rowdata = rowData;
    this.display = true;
  }

  showConfirm(rowData: any) {
    this.rowdata = rowData;
    this._messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }

  delete(id) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

  onConfirm(id: any) {
    this._spinner.show();
    this._service.delete(id).then(res => {
      this._spinner.hide();
      this.getViewData(this.currentPage);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully!' });
    }).catch(err => {
      this._spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
    this._messageService.clear('c');
  }

  onReject() {
    this._messageService.clear('c');
  }

}
