import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidbarComponent } from './asidbar.component';

describe('AsidbarComponent', () => {
  let component: AsidbarComponent;
  let fixture: ComponentFixture<AsidbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsidbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsidbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
