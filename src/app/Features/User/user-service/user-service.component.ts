import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import AOS from 'aos';
@Component({
  selector: 'app-user-service',
  imports: [],
  templateUrl: './user-service.component.html',
  styleUrl: './user-service.component.css',
})
export class UserServiceComponent implements OnInit {
  service: DocumentData[] = [];
  ngOnInit(): void {
    AOS.init();
    this.getDocuments();
  }
  constructor(private firebaseService: FirebaseService) {}
  getDocuments(): void {
    this.firebaseService.getDocuments('service').subscribe({
      next: (docs) => {
        this.service = docs.map((doc: any) => {
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
