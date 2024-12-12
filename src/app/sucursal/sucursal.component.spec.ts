import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SucursalComponent } from './sucursal.component';

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-auth-domain',
  projectId: 'test-project-id',
  storageBucket: 'test-storage-bucket',
  messagingSenderId: 'test-sender-id',
  appId: 'test-app-id',
};

describe('SucursalComponent', () => {
  let component: SucursalComponent;
  let fixture: ComponentFixture<SucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SucursalComponent],
      imports: [HttpClientTestingModule, AngularFireModule.initializeApp(firebaseConfig)],
			providers: [AngularFireAuth],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
