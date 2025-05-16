import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExperienceComponent } from './user-experience.component';

describe('UserExperienceComponent', () => {
  let component: UserExperienceComponent;
  let fixture: ComponentFixture<UserExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
