import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { RouterLink } from '@angular/router';
import AOS from "aos"
@Component({
  selector: 'app-portfolio',
  imports: [RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
  
})
export class PortfolioComponent implements OnInit {
  projectDocuments: DocumentData[] = [];
  showAll: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    AOS.init();
    this.getDocuments();
  }

  getDocuments(): void {
    this.firebaseService.getDocuments('projects').subscribe({
      next: (docs) => {
        this.projectDocuments = docs.map((doc: any) => ({
          ...doc,
          id: doc.id,
        }));
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      },
    });
  }

  get visibleProjects() {
    return this.showAll ? this.projectDocuments : this.projectDocuments.slice(0, 3);
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}

