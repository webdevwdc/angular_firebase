import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShiftService } from '../shift.service';
import { PagerService } from 'src/app/services/pager/pager.service';


@Component({
  selector: 'app-myshift',
  templateUrl: './myshift.component.html',
  styleUrls: ['./myshift.component.scss']
})
export class MyshiftComponent implements OnInit {

  rows = [];
  allItems: any[];
  pager: any = {};
  currentPage = 1;
  associate: any;

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private shiftService: ShiftService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _pagerService: PagerService,
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(currentPage?: number) {
    this.spinner.show();
    this.ac.params.subscribe(params => {
      this.shiftService.getAssociateId(params.associate_id).then(associate => {
        this.associate = associate;
        this.shiftService.getByAssociateAndManager(params.associate_id, associate['manager']).then(resp => {
          if (resp.length > 0) {
            this.allItems = resp[0].data.shift;
            this.getDataByPage(currentPage || this.currentPage);
            this.spinner.hide();
          }
          this.spinner.hide();
        }).catch(err => {
          this.spinner.hide();
        });
      });
    });
  }

  getDataByPage(page: number) {
    this.currentPage = page;
    this.pager = this._pagerService.getPager(this.allItems.length, page);
    this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
