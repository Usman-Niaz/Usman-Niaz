import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { DocumentData } from 'firebase/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { ToastComponent } from "../../../Shared/Toast/toast.component";
@Component({
  selector: 'app-projects',
  imports: [
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    CommonModule,
    ToastComponent
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit{
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;
  isSubmitting = false;
  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  projectDocuments: DocumentData[] = [];
  ngOnInit(): void {
    this.getDocuments();
  }
  constructor(private fb: FormBuilder,
      private firebaseService: FirebaseService) {
    this.profileForm = this.fb.group({
      projectName: ['', Validators.required],
      projectLink: ['', Validators.required],
      projectShortDescription: ['', Validators.required],
      projectFullDescription: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedImage = file; // ✅ store file
      this.previewUrl = URL.createObjectURL(file);

      // ✅ update form control value
      this.profileForm.patchValue({ image: file });
      this.profileForm.get('image')?.updateValueAndValidity();
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

        this.firebaseService.addDocument('projects', formData).subscribe({
          next: (docRef) => {
            this.isSubmitting = false;
            this.toastMessage = 'Project Section data added successfully!';
            this.toastType = 'success';
            this.isToastVisible = true;

            this.profileForm.reset({
              projectName:'',
              projectLink:'',
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
            this.toastMessage = 'Error adding Project Section data.';
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
    this.firebaseService.getDocuments('projects').subscribe({
      next: (docs) => {
        this.projectDocuments = docs.map((doc: any) => {
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

    this.firebaseService.deleteDocument('projects', docId).subscribe({
      next: (response) => {
        this.projectDocuments = this.projectDocuments.filter(
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
