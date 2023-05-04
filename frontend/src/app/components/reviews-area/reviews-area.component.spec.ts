import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsAreaComponent } from './reviews-area.component';

describe('ReviewsAreaComponent', () => {
  let component: ReviewsAreaComponent;
  let fixture: ComponentFixture<ReviewsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
