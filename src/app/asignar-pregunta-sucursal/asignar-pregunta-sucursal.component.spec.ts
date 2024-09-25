import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPreguntaSucursalComponent } from './asignar-pregunta-sucursal.component';

describe('AsignarPreguntaSucursalComponent', () => {
  let component: AsignarPreguntaSucursalComponent;
  let fixture: ComponentFixture<AsignarPreguntaSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignarPreguntaSucursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarPreguntaSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
