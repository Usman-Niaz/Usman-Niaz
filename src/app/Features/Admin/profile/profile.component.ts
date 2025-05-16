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
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { ToastComponent } from '../../../Shared/Toast/toast.component';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  imports: [
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    CommonModule,
    ToastComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileForm: FormGroup;
  isToastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  isSubmitting: boolean = false;
  profilesDocuments: DocumentData[] = [];

  ngOnInit(): void {
    this.getDocuments();
  }

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService // Inject FirebaseService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      social: this.fb.group({
        facebook: ['', Validators.required],
        instagram: ['', Validators.required],
        fiverr: ['', Validators.required],
        github: ['', Validators.required],
        linkedin: ['', Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      const profileData = this.profileForm.value;
      this.firebaseService.addDocument('profiles', profileData).subscribe({
        next: (docRef) => {
          this.isSubmitting = false;
          if (docRef && docRef.id) {
            this.toastMessage = 'Profile Data Added Successfully!';
            this.toastType = 'success';
            this.isToastVisible = true;
            this.profileForm.reset({
              name: '',
              address: '',
              phone: '',
              email: '',
              social: {
                facebook: '',
                instagram: '',
                fiverr: '',
                github: '',
                linkedin: '',
              },
            });
            // Refresh the page after short delay
            setTimeout(() => {
              window.location.reload();
            }, 1000); 
          } else {
            this.toastMessage = 'Error: Data was not added to Firestore.';
            this.toastType = 'error';
            this.isToastVisible = true;
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error:', err);
          this.toastMessage = 'Error adding profile data. Please try again.';
          this.toastType = 'error';
          this.isToastVisible = true;
        },
      });
    } else {
      this.toastMessage = 'Please fill in all required fields.';
      this.toastType = 'error';
      this.isToastVisible = true;
    }
  }
  getDocuments(): void {
    this.firebaseService.getDocuments('profiles').subscribe({
      next: (docs) => {
        this.profilesDocuments = docs.map((doc: any) => {
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

    this.firebaseService.deleteDocument('profiles', docId).subscribe({
      next: (response) => {
        this.profilesDocuments = this.profilesDocuments.filter(
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
