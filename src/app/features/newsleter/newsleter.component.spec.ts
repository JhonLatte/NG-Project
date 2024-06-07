import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsleterComponent } from './newsleter.component';

describe('NewsleterComponent', () => {
  let component: NewsleterComponent;
  let fixture: ComponentFixture<NewsleterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsleterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsleterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
