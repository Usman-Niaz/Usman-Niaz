import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';
import { ToastComponent } from '../../../Shared/Toast/toast.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FirebaseService } from '../../../Core/Service/firebase.service';

@Component({
  selector: 'app-work-process',
  standalone: true,
  imports: [
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    CommonModule,
    ToastComponent,
  ],
  templateUrl: './work-process.component.html',
  styleUrl: './work-process.component.css',
})
export class WorkProcessComponent {
  isSubmitting = false;
  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  workProcess: DocumentData[] = [];

  profileForm: FormGroup;
  ngOnInit(): void {
    this.getDocuments();
  }

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.profileForm = this.fb.group({
      workDescription: ['', Validators.required],
      rearchDescription: ['', Validators.required],
      analyzeDescription: ['', Validators.required],
      designDescription: ['', Validators.required],
      launchDescription: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;

      const formData = { ...this.profileForm.value };

      this.firebaseService.addDocument('workProcess', formData).subscribe({
        next: (docRef) => {
          this.isSubmitting = false;
          this.toastMessage = 'Work Process data added successfully!';
          this.toastType = 'success';
          this.isToastVisible = true;

          this.profileForm.reset({
            workDescription: '',
            rearchDescription: '',
            analyzeDescription: '',
            designDescription: '',
            launchDescription: '',
          });

          // Refresh the page after short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastMessage = 'Error adding Work Process data.';
          this.toastType = 'error';
          this.isToastVisible = true;
        },
      });
    } else {
      this.toastMessage = 'Please fill all required fields';
      this.toastType = 'error';
      this.isToastVisible = true;
    }
  }
  getDocuments(): void {
    this.firebaseService.getDocuments('workProcess').subscribe({
      next: (docs) => {
        this.workProcess = docs.map((doc: any) => {
          return {
            ...doc, // Spread the document data
            id: doc.id, // Ensure the 'id' field is added
          };
        });
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.toastMessage = 'Error fetching hero section data.';
        this.toastType = 'error';
        this.isToastVisible = true;
      },
    });
  }

  deleteDocument(docId: string): void {
    if (!docId) {
      console.error('Document ID is undefined or null');
      return;
    }
    this.toastMessage = 'Document is deleting ........';
    this.toastType = 'success';
    this.isToastVisible = true;

    this.firebaseService.deleteDocument('workProcess', docId).subscribe({
      next: (response) => {
        this.workProcess = this.workProcess.filter(
          (doc) => doc['id'] !== docId
        );
        this.toastMessage = 'Document deleted successfully!';
        this.toastType = 'success';
        this.isToastVisible = true;

        // Refresh the page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Error deleting document:', err);
        this.toastMessage = 'Error deleting document.';
        this.toastType = 'error';
        this.isToastVisible = true;
      },
    });
  }
}
