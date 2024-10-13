import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionPeriodoComponent } from './informacion-periodo.component';

describe('InformacionPeriodoComponent', () => {
  let component: InformacionPeriodoComponent;
  let fixture: ComponentFixture<InformacionPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacionPeriodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
