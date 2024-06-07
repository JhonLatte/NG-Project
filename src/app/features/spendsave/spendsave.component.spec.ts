import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendsaveComponent } from './spendsave.component';

describe('SpendsaveComponent', () => {
  let component: SpendsaveComponent;
  let fixture: ComponentFixture<SpendsaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendsaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendsaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
