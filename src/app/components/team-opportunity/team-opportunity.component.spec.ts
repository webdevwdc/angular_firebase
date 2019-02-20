import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOpportunityComponent } from './team-opportunity.component';

describe('TeamOpportunityComponent', () => {
  let component: TeamOpportunityComponent;
  let fixture: ComponentFixture<TeamOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
