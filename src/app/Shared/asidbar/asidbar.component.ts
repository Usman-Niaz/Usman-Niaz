import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-asidbar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './asidbar.component.html',
  styleUrl: './asidbar.component.css'
})
export class AsidbarComponent implements OnInit{
  @Input() isOpen = true;
  @Output() toggle = new EventEmitter<void>();
  ngOnInit(): void {
    this.firebaseService.getDocuments('hero').subscribe({
      next: (docs) => {
        this.heroDocuments = docs.map((doc: any) => {
          return {
            ...doc,  // Spread the document data
            id: doc.id  // Ensure the 'id' field is added
          };
        });
  
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
      }
    });
  }
    heroDocuments: DocumentData[] = [];
  constructor( private firebaseService: FirebaseService) {
   
  }
  routes = [
    { label: 'Profile', path: '/admin/profile', icon: 'person' },
    { label: 'Hero Section', path: '/admin/hero', icon: 'bolt' },
    { label: 'Introduction', path: '/admin/intro', icon: 'info' },
    { label: 'Work Process', path: '/admin/work', icon: 'sync' },
    { label: 'Projects', path: '/admin/projects', icon: 'computer	' },
    { label: 'What I do?', path: '/admin/service', icon: 'build' },
    { label: 'Experience', path: '/admin/experience', icon: 'history' },
    { label: 'Skills', path: '/admin/skill', icon: 'code' },  
    { label: 'Testimonials', path: '/admin/testimonials', icon: 'chat' },
    { label: 'Feedback', path: '/admin/feedback', icon: 'star_rate' },
  ];
  

  selectedIndex = 0;

  // No longer toggles inside here
  toggleSidebar() {
    this.toggle.emit(); // tell parent to toggle
  }

  setSelected(index: number) {
    this.selectedIndex = index;
  }
 
 
}