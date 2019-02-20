import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectTypeService } from '../project-type.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editedID: any;
  currentPage;
  projectTypeForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _service: ProjectTypeService,
    private _messageService: MessageService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private ac: ActivatedRoute
  ) {
    this.projectTypeForm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      isTimeRequired: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this._spinner.show();
    this.ac.params.subscribe(params => {
      this.ac.queryParams
        .subscribe(params1 => {
          if (Object.keys(params1).length > 0) {
            this.currentPage = params1[Object.keys(params)[0]];
          }
        });

      this.editedID = params['id'];
      this._service.getById(this.editedID).then(response => {
        this.projectTypeForm.patchValue(response.data);
        this._spinner.hide();
      }).catch(_ => {
        this._spinner.hide();
      });
    });
  }

  submit() {
    this._spinner.show();
    if (!this.projectTypeForm.valid) {
      this._spinner.hide();
      Object.keys(this.projectTypeForm.controls).forEach(key => {
        this.projectTypeForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.projectTypeForm.value['id'] = this.editedID;
      this._service.save(this.projectTypeForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Project type updated successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/project-type/list'], { queryParams: { page: this.currentPage } });
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }
}
