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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DocumentData } from 'firebase/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { ToastComponent } from '../../../Shared/Toast/toast.component';
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    CommonModule,
    MatProgressSpinnerModule,
    ToastComponent,
  ],
  providers: [provideNativeDateAdapter()], // ✅ Add this line
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnInit {
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;
  isToastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  experienceDocuments: DocumentData[] = [];
  ngOnInit(): void {
    this.getDocuments();
  }
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.profileForm = this.fb.group({
      description: ['', Validators.required],
      title: ['', Validators.required],
      image: [null, Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.profileForm.patchValue({ image: reader.result });
        this.profileForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.selectedFile) {
      this.isSubmitting = true;

      const formData = { ...this.profileForm.value };

      this.firebaseService.addDocument('experience', formData).subscribe({
        next: (docRef) => {
          this.isSubmitting = false;
          this.toastMessage = 'Experience Section Data Added Successfully!';
          this.toastType = 'success';
          this.isToastVisible = true;

          this.profileForm.reset({
            description: '',
            title: '',
            fromDate: '',
            toDate: '',
            image: null,
          });
          this.previewUrl = null;
          this.selectedFile = null;
          // Refresh the page after short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastMessage = 'Error adding hero section data.';
          this.toastType = 'error';
          this.isToastVisible = true;
        },
      });
    } else {
      this.toastMessage =
        'Please fill in all required fields and select an image.';
      this.toastType = 'error';
      this.isToastVisible = true;
    }
  }
  getDocuments(): void {
    this.firebaseService.getDocuments('experience').subscribe({
      next: (docs) => {
        this.experienceDocuments = docs.map((doc: any) => {
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

    this.firebaseService.deleteDocument('experience', docId).subscribe({
      next: (response) => {
        this.experienceDocuments = this.experienceDocuments.filter(
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
