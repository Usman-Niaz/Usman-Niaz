import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { ToastComponent } from '../../../Shared/Toast/toast.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-intro',
  standalone: true,
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
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;
  isSubmitting = false;
  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  heroDocuments: DocumentData[] = [];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.profileForm = this.fb.group({
      description: ['', Validators.required],
      title: ['', Validators.required],
      image: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.getDocuments();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.profileForm.patchValue({ image: file });
        this.profileForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid && this.selectedImage) {
      this.isSubmitting = true;
      // Check image size before submitting (example: 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (this.selectedImage.size > maxSize) {
        this.isSubmitting = false;
        this.toastMessage =
          'Image size exceeds the maximum allowed size of 5MB.';
        this.toastType = 'error';
        this.isToastVisible = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const formData = {
          ...this.profileForm.value,
          image: reader.result, // Image ko Base64 format me store karna
        };

        this.firebaseService.addDocument('introduction', formData).subscribe({
          next: (docRef) => {
            this.isSubmitting = false;
            this.toastMessage = 'Introduction data added successfully!';
            this.toastType = 'success';
            this.isToastVisible = true;

            this.profileForm.reset({
              description: '',
              title: '',
              image: null,
            });
            this.previewUrl = null;
            this.selectedImage = null;
            // Refresh the page after short delay
            setTimeout(() => {
              window.location.reload();
            }, 1000); 
          },
          error: (err) => {
            this.isSubmitting = false;
            this.toastMessage = 'Error adding introduction data.';
            this.toastType = 'error';
            this.isToastVisible = true;
          },
        });
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.toastMessage =
        'Please fill all required fields and select an image.';
      this.toastType = 'error';
      this.isToastVisible = true;
    }
  }
  
  getDocuments(): void {
    this.firebaseService.getDocuments('introduction').subscribe({
      next: (docs) => {
        this.heroDocuments = docs.map((doc: any) => {
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

    this.firebaseService.deleteDocument('introduction', docId).subscribe({
      next: (response) => {
        this.heroDocuments = this.heroDocuments.filter(
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
