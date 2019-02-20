import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyshiftComponent } from './myshift.component';

describe('MyshiftComponent', () => {
  let component: MyshiftComponent;
  let fixture: ComponentFixture<MyshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
