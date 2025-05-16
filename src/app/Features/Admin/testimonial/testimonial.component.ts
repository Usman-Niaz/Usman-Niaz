import { Component, OnInit } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { ToastComponent } from '../../../Shared/Toast/toast.component';

@Component({
  selector: 'app-testimonial',
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
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css',
})
export class TestimonialComponent implements OnInit {
  isSubmitting = false;
  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  testimonial: DocumentData[] = [];
  profileForm: FormGroup;
  ngOnInit(): void {
    this.getDocuments();
  }
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.profileForm = this.fb.group({
      testimonial: ['', Validators.required],
      reviewer: ['', Validators.required],
      designation: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;

      const formData = { ...this.profileForm.value };

      this.firebaseService.addDocument('testimonial', formData).subscribe({
        next: (docRef) => {
          this.isSubmitting = false;
          this.toastMessage = 'Testimonial data added successfully!';
          this.toastType = 'success';
          this.isToastVisible = true;

          this.profileForm.reset({
            testimonial: '',
            designation: '',
            reviewer: '',
          });

          // Refresh the page after short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastMessage = 'Error adding Testimonial data.';
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
    this.firebaseService.getDocuments('testimonial').subscribe({
      next: (docs) => {
        this.testimonial = docs.map((doc: any) => {
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
    this.toastMessage = 'Document is deleting.......... ';
    this.toastType = 'success';
    this.isToastVisible = true;

    this.firebaseService.deleteDocument('testimonial', docId).subscribe({
      next: (response) => {
        this.testimonial = this.testimonial.filter(
          (doc) => doc['id'] !== docId
        );
        this.toastMessage = 'Document deleted successfully!';
        this.toastType = 'success';
        this.isToastVisible = true;
        setTimeout(() => {
          window.location.reload();
        }, 1500); // wait 1.5 seconds to show toast
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
