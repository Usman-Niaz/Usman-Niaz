import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faLock,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { ToastComponent } from '../../../Shared/Toast/toast.component';
import { Router } from '@angular/router';
import { AdminLogin } from '../../../Core/interface/admin-login';
@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, ReactiveFormsModule, NgIf, ToastComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  iconEnvelope = faEnvelope;
  iconLock = faLock;
  iconLogin = faSignInAlt;
  loginForm: FormGroup;
  adminData: AdminLogin[] = [];

  // Toast properties
  isToastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  private authKey = 'isLoggedIn';
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.firebaseService.getAdminLoginData().subscribe(
      (data: AdminLogin[]) => {
        this.adminData = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  get f() {
    return this.loginForm.controls;
  }

  // Submit method
  onSubmit() {
    if (this.loginForm.invalid) {
      return; // Do nothing if the form is invalid
    }

    const formEmail = this.loginForm.value.email;
    const formPassword = this.loginForm.value.password;

    const admin = this.adminData.find(
      (admin) => admin.Email === formEmail && admin.Password === formPassword
    );

    if (admin) {
      this.toastMessage = 'Login successful';
      this.toastType = 'success';
      this.isToastVisible = true;

      // Delay navigation by 2 seconds
      setTimeout(() => {
        this.router.navigate(['/admin/home']);
        
        localStorage.setItem(this.authKey, 'true');
      }, 1000); // 2000 milliseconds = 2 seconds
    } else {
      this.toastMessage = 'Invalid email or password';
      this.toastType = 'error';
      this.isToastVisible = true;
    }
  }
}
