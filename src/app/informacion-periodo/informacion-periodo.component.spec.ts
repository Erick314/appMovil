import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InformacionPeriodoComponent } from './informacion-periodo.component';

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-auth-domain',
  projectId: 'test-project-id',
  storageBucket: 'test-storage-bucket',
  messagingSenderId: 'test-sender-id',
  appId: 'test-app-id',
};

describe('InformacionPeriodoComponent', () => {
  let component: InformacionPeriodoComponent;
  let fixture: ComponentFixture<InformacionPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacionPeriodoComponent],
			imports: [HttpClientTestingModule, AngularFireModule.initializeApp(firebaseConfig)],
			providers: [AngularFireAuth],

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
