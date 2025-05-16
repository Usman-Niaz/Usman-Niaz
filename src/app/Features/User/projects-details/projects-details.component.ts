import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../Core/Service/firebase.service';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingServiceService } from '../../../Core/Service/loading.service'; // <-- import spinner service
import AOS from "aos"
@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [CommonModule, UserHeaderComponent, FooterComponent, NgxSpinnerModule],
  templateUrl: './projects-details.component.html',
  styleUrl: './projects-details.component.css',
})
export class ProjectsDetailsComponent implements OnInit {
  projectId: string = '';
  project: any;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private loadingService: LoadingServiceService // <-- inject the spinner service
  ) {}

  ngOnInit(): void {
    AOS.init();
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      this.loadingService.show(); // Show spinner before fetching

      this.firebaseService.getSingleDocument('projects', this.projectId).subscribe({
        next: (data) => {
          this.project = data;
          this.loadingService.hide(); // Hide spinner after success
        },
        error: (err) => {
          console.error('Error fetching project:', err);
          this.loadingService.hide(); // Hide spinner even on error
        },
      });
    }
  }
}
