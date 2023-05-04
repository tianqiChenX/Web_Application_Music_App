import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLinkComponent } from './policy-link.component';

describe('PolicyLinkComponent', () => {
  let component: PolicyLinkComponent;
  let fixture: ComponentFixture<PolicyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
