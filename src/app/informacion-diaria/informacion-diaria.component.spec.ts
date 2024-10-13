import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionDiariaComponent } from './informacion-diaria.component';

describe('InformacionDiariaComponent', () => {
  let component: InformacionDiariaComponent;
  let fixture: ComponentFixture<InformacionDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacionDiariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
