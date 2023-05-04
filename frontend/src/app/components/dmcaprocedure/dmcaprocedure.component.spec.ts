import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMCAProcedureComponent } from './dmcaprocedure.component';

describe('DMCAProcedureComponent', () => {
  let component: DMCAProcedureComponent;
  let fixture: ComponentFixture<DMCAProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMCAProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DMCAProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
