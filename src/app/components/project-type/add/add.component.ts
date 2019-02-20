import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectTypeService } from '../project-type.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  projectTypeForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _service: ProjectTypeService,
    private _messageService: MessageService,
    private _spinner: NgxSpinnerService,
    private _router: Router
  ) {
    this.projectTypeForm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      isTimeRequired: new FormControl(true, [Validators.required])
    });
  }

  ngOnInit() {
  }

  submit() {
    this._spinner.show();
    if (!this.projectTypeForm.valid) {
      this._spinner.hide();
      Object.keys(this.projectTypeForm.controls).forEach(key => {
        this.projectTypeForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this._service.save(this.projectTypeForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Project type added successfully.' });
        setTimeout(() => {
          this._router.navigate(['/app/project-type/list']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
