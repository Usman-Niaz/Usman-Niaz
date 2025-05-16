import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { CommonModule } from '@angular/common';
import { LoadingServiceService } from '../../../Core/Service/loading.service';
import AOS from 'aos';
@Component({
  selector: 'app-intro',
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
})
export class IntroComponent implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private Loading: LoadingServiceService
  ) {}
  heroDocuments: DocumentData[] = [];
  profile: DocumentData[] = [];
  ngOnInit(): void {
    AOS.init();
    this.getDocuments();
    this.getProfileDocuments();
  }
  getDocuments(): void {
    this.Loading.show(); // Show spinner before data loading

    this.firebaseService.getDocuments('introduction').subscribe({
      next: (docs) => {
        this.heroDocuments = docs.map((doc: any) => {
          return {
            ...doc,
            id: doc.id,
          };
        });
        this.Loading.hide(); // Hide spinner after data is loaded
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.Loading.hide(); // Hide spinner even if there's an error
      },
    });
  }

  getProfileDocuments(): void {
    this.firebaseService.getDocuments('profiles').subscribe({
      next: (docs) => {
        this.profile = docs.map((doc: any) => {
          return {
            ...doc, // Spread the document data
            id: doc.id, // Ensure the 'id' field is added
          };
        });
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      },
    });
  }
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
