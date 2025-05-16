import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  heroDocuments: DocumentData[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.firebaseService.getDocuments('introduction').subscribe({
      next: (docs) => {
        this.heroDocuments = docs.map((doc: any) => ({
          ...doc,
          id: doc.id
        }));
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      }
    });
  }

  logout(): void {
    this.firebaseService.logout();
    this.router.navigate(['/admin/login']);
  }
}
