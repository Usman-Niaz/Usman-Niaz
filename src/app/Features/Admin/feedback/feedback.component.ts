import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor } from '@angular/common';
@Component({
  selector: 'app-feedback',
  imports: [MatCardModule,CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  feedback: DocumentData[] = [];
   constructor(
      private firebaseService: FirebaseService,
    ) {}
      ngOnInit(): void {
    this.firebaseService.getDocuments('Contact').subscribe({
      next: (docs) => {
        this.feedback = docs.map((doc: any) => ({
          ...doc,
          id: doc.id
        }));
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      }
    });
  }

}
