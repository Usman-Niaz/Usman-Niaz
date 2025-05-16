import { Component, OnInit } from '@angular/core';
import AOS from "aos"
@Component({
  selector: 'app-project-discussion',
  imports: [],
  templateUrl: './project-discussion.component.html',
  styleUrl: './project-discussion.component.css'
})
export class ProjectDiscussionComponent implements OnInit {
ngOnInit(): void {
      AOS.init();
}
scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
