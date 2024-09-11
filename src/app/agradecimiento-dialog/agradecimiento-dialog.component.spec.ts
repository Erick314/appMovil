import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgradecimientoDialogComponent } from './agradecimiento-dialog.component';

describe('AgradecimientoDialogComponent', () => {
  let component: AgradecimientoDialogComponent;
  let fixture: ComponentFixture<AgradecimientoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgradecimientoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgradecimientoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
