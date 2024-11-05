import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpresaDialogComponent } from './edit-empresa-dialog.component';

describe('EditEmpresaDialogComponent', () => {
  let component: EditEmpresaDialogComponent;
  let fixture: ComponentFixture<EditEmpresaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEmpresaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmpresaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
