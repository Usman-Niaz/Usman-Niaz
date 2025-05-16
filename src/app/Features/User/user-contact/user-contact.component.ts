import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from "../../../Shared/Toast/toast.component";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-user-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ToastComponent,
    MatProgressSpinnerModule
],
  templateUrl: './user-contact.component.html',
  styleUrl: './user-contact.component.css',
})
export class UserContactComponent implements OnInit{
    isSubmitting = false;
  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  contactForm: FormGroup;
  profilesDocuments: DocumentData[] = [];
  userData: any;
ngOnInit(): void {
  this.getDocuments();
  
}
  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: ['',Validators.required],
      budget: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formData = { ...this.contactForm.value };

      this.firebaseService.addDocument('Contact', formData).subscribe({
        next: (docRef) => {
          this.isSubmitting = false;
          this.toastMessage = ' Message Send successfully!';
          this.toastType = 'success';
          this.isToastVisible = true;
          setTimeout(() => {
          window.location.reload();
        }, 1500);

          this.contactForm.reset({
            name: '',
            email: '',
            location: '',
            budget: '',
            subject: '',
            message: '',
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastMessage = 'Error sending data.';
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
    this.firebaseService.getDocuments('profiles').subscribe({
      next: (docs) => {
        this.profilesDocuments = docs.map((doc: any) => ({ ...doc, id: doc.id }));
        this.userData = this.profilesDocuments[0];
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      },
    });
  }
}
