import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { CategoryService } from '../category.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  categoryEditForm: FormGroup;
  formInvalid: boolean;
  currentPage: Number;

  constructor(
    private categoryService: CategoryService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.categoryEditForm = new FormGroup({
      categoryName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
    });
  }

  ngOnInit() {
    this.ac.params.subscribe(params => {
      this.ac.queryParams
        .subscribe(params1 => {
          if (Object.keys(params1).length > 0) {
            this.currentPage = params1[Object.keys(params1)[0]];
          }
        });

      this.categoryService.getById(params.id).then(resp => {
        this.categoryEditForm.patchValue({
          id: params.id,
        });
        this.categoryEditForm.patchValue(resp.data);
      }).catch(err => { });
    });
  }

  save(data) {
    this.spinner.show();
    if (!this.categoryEditForm.valid) {
      Object.keys(this.categoryEditForm.controls).forEach(key => {
        this.categoryEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this.categoryService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/category/list'], { queryParams: { page: this.currentPage } });
        }, 500);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
