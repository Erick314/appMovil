import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaModalComponent } from './pregunta-modal.component';

describe('PreguntaModalComponent', () => {
  let component: PreguntaModalComponent;
  let fixture: ComponentFixture<PreguntaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreguntaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
