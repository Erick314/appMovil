import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditEmpresaDialogComponent } from './edit-empresa-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-auth-domain',
  projectId: 'test-project-id',
  storageBucket: 'test-storage-bucket',
  messagingSenderId: 'test-sender-id',
  appId: 'test-app-id',
};

describe('EditEmpresaDialogComponent', () => {
  let component: EditEmpresaDialogComponent;
  let fixture: ComponentFixture<EditEmpresaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEmpresaDialogComponent],
      imports: [HttpClientTestingModule, AngularFireModule.initializeApp(firebaseConfig)],
      providers: [AngularFireAuth,
        { provide: MatDialogRef, useValue: {} },
			  { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
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
