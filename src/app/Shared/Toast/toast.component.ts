import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, Signal, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() messageType: 'success' | 'error' = 'success';  // Default is success
  
  // Initialize the signal
  showToast = signal(false);

  private toastTimeout: any;

  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  ngOnInit() {
    // Automatically show the toast for 2 seconds
    this.showToast.set(true);

    // Automatically hide the toast after 2 seconds
    this.toastTimeout = setTimeout(() => {
      this.showToast.set(false);
    }, 4000);  // Change this value for different durations
  }

  ngOnDestroy() {
    clearTimeout(this.toastTimeout);  // Clear timeout if component is destroyed
  }
}
