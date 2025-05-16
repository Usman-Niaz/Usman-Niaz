import { Component, OnInit } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { CommonModule } from '@angular/common';
import { IntroComponent } from '../intro/intro.component';
import AOS from "aos"
@Component({
  selector: 'app-hero',
  imports: [CommonModule, IntroComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  constructor (private firebaseService: FirebaseService){

  }
  heroDocuments: DocumentData[] = [];
  profile: DocumentData[] = [];
  ngOnInit(): void {
     AOS.init();
    this.getDocuments();
    this.getProfileDocuments();
  }
  getDocuments(): void {
    this.firebaseService.getDocuments('hero').subscribe({
      next: (docs) => {
        this.heroDocuments = docs.map((doc: any) => {
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
