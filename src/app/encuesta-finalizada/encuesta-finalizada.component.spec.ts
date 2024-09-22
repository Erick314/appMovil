import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaFinalizadaComponent } from './encuesta-finalizada.component';

describe('EncuestaFinalizadaComponent', () => {
  let component: EncuestaFinalizadaComponent;
  let fixture: ComponentFixture<EncuestaFinalizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncuestaFinalizadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaFinalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
