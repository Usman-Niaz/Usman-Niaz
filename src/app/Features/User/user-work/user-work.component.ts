import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import AOS from 'aos';
@Component({
  selector: 'app-user-work',
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-work.component.html',
  styleUrl: './user-work.component.css',
})
export class UserWorkComponent implements OnInit {
  workProcess: DocumentData[] = [];
  ngOnInit(): void {
    AOS.init();
    this.getDocuments();
  }
  constructor(private firebaseService: FirebaseService) {}
  getDocuments(): void {
    this.firebaseService.getDocuments('workProcess').subscribe({
      next: (docs) => {
        this.workProcess = docs.map((doc: any) => {
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
