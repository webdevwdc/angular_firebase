import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';

import { ShiftService } from '../shift.service';
import { LoginService } from 'src/app/core/services';

@Component({
  selector: 'app-list-shift',
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
    private shiftService: ShiftService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService
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
    this._loginService.currentUser().then(current_user => {
      this.shiftService.getAllAssociate(current_user['id']).then(resp => {
        this.allItems = resp;
        this.getDataByPage(currentPage || this.currentPage);
        this.spinner.hide();
      }).catch(_ => {
        this.spinner.hide();
      });
    }).catch(_ => {
      this.spinner.hide();
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  goToEdit(id) {
    this.router.navigate(['app/shift/edit/' + id], { queryParams: { page: this.currentPage } });
  }

}
