import { Component, OnInit } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import AOS from "aos"
@Component({
  selector: 'app-user-skills',
  imports: [],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.css'
})
export class UserSkillsComponent implements OnInit{
  skillDocuments: DocumentData[] = [];
  constructor(private firebaseService: FirebaseService){}
    ngOnInit(): void {
          AOS.init();
    this.getDocuments();
  }
    getDocuments(): void {
    this.firebaseService.getDocuments('skills').subscribe({
      next: (docs) => {
        this.skillDocuments = docs.map((doc: any) => {
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
