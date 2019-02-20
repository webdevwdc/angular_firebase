import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShiftService } from '../shift.service';
import { LoginService } from 'src/app/core/services';


@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  shiftAddForm: FormGroup;
  updatedId: any;
  projectTitle: string;
  currentPage;
  currentUser: any;
  associate: any;
  constructor(
    private shiftService: ShiftService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
    private _fb: FormBuilder
  ) {
    this.shiftAddForm = this._fb.group({
      shift: this._fb.array([]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.ac.params.subscribe(params => {

      this.ac.queryParams
        .subscribe(query_params => {
          if (Object.keys(params).length > 0) {
            this.currentPage = params[Object.keys(query_params)[0]];
          }
        });

      this._loginService.currentUser().then(current_user => {
        this.currentUser = current_user;
        this.shiftService.getAssociateId(params.associate_id).then(associate => {
          this.associate = associate;
          this.shiftService.getByAssociateAndManager(params.associate_id, current_user['id']).then(resp => {
            if (resp.length > 0) {
              if (resp[0].data.shift.length > 0) {
                resp[0].data.shift.forEach(item => {
                  this.addNewDeckRow();
                });
              } else {
                this.addNewDeckRow();
              }
            } else {
              this.addNewDeckRow();
            }

            this.shiftAddForm.patchValue(resp[0].data);
            this.spinner.hide();
          }).catch(err => {
            this.spinner.hide();
          });
        });
      }).catch(error => {
        this.spinner.hide();
      });
    });
  }

  initShift(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      day: ['', Validators.required]
      , start_time: ['', Validators.required]
      , end_time: ['', Validators.required]
    });
  }

  addNewDeckRow() {
    const control = <FormArray>this.shiftAddForm.controls.shift;
    control.push(this.initShift());
  }

  deleteDeckRow(i: number): void {
    const control = <FormArray>this.shiftAddForm.controls.shift;
    control.removeAt(i);
  }


  save(data) {
    this.spinner.show();
    if (!this.shiftAddForm.valid) {
      Object.keys(this.shiftAddForm.controls).forEach(key => {
        this.shiftAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      data.associate_id = this.associate['id'];
      data.manager_id = this.currentUser['id'];
      this.shiftService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Shift updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/shift/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
