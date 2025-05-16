import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestimonialComponent } from './user-testimonial.component';

describe('UserTestimonialComponent', () => {
  let component: UserTestimonialComponent;
  let fixture: ComponentFixture<UserTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTestimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
