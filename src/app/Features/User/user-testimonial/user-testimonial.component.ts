import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { DocumentData } from 'firebase/firestore';
import AOS from 'aos'
@Component({
  selector: 'app-user-testimonial',
  imports: [],
  templateUrl: './user-testimonial.component.html',
  styleUrl: './user-testimonial.component.css'
})
export class UserTestimonialComponent implements OnInit {
  testimonial: DocumentData[] = [];
  constructor(private firebaseService: FirebaseService){  }
    ngOnInit(): void {
      AOS.init();
    this.getDocuments();
  }
    getDocuments(): void {
    this.firebaseService.getDocuments('testimonial').subscribe({
      next: (docs) => {
        this.testimonial = docs.map((doc: any) => {
          return {
            ...doc, // Spread the document data
            id: doc.id, // Ensure the 'id' field is added
          };
        });
      },
      error: (err) => {
        console.error('Error fetching documents:', err);;
      },
    });
  }
}
