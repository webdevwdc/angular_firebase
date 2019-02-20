import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  categoryAddForm: FormGroup;
  formInvalid: boolean;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.categoryAddForm = new FormGroup({
      categoryName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
    });
  }

  ngOnInit() {
  }

  save(data) {
    this.spinner.show();
    if (!this.categoryAddForm.valid) {
      Object.keys(this.categoryAddForm.controls).forEach(key => {
        this.categoryAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.categoryService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully' });
        setTimeout(() => {
          this.router.navigate(['app/category/list']);
        }, 2000);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
