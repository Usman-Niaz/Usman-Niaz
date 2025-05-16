import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-experience',
  imports: [CommonModule],
  templateUrl: './user-experience.component.html',
  styleUrl: './user-experience.component.css'
})
export class UserExperienceComponent implements OnInit {
  experienceDocuments: DocumentData[] = [];
  constructor( private firebaseService: FirebaseService){}
    ngOnInit(): void {
    this.getDocuments();
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
      },
    });
  }
}
