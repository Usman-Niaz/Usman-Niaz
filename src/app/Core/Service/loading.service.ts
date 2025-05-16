import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
 
 
@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private loadingCount = 0;
 
  constructor(private spinner: NgxSpinnerService) { }
 
  show() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.spinner.show();
    }
  }
 
  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.spinner.hide();
    }
  }
 
  reset() {
    this.loadingCount = 0;
    this.spinner.hide();
  }
 
}
 