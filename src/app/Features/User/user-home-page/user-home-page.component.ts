import { Component } from '@angular/core';
import { HeaderComponent } from "../../Admin/header/header.component";
import { FeedbackComponent } from "../../Admin/feedback/feedback.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { UserHeaderComponent } from "../user-header/user-header.component";
import { HeroComponent } from '../hero/hero.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserWorkComponent } from "../user-work/user-work.component";
import { PortfolioComponent } from "../portfolio/portfolio.component";
import { ProjectDiscussionComponent } from "../project-discussion/project-discussion.component";
import { UserServiceComponent } from "../user-service/user-service.component";
import { UserSkillsComponent } from "../user-skills/user-skills.component";
import { UserExperienceComponent } from "../user-experience/user-experience.component";
import { UserTestimonialComponent } from "../user-testimonial/user-testimonial.component";
import { UserContactComponent } from "../user-contact/user-contact.component";

@Component({
  selector: 'app-user-home-page',
  imports: [RouterOutlet, FooterComponent, UserHeaderComponent, HeroComponent, NgxSpinnerModule, MatProgressSpinnerModule, UserWorkComponent, PortfolioComponent, ProjectDiscussionComponent, UserServiceComponent, UserSkillsComponent, UserExperienceComponent, UserTestimonialComponent, UserContactComponent],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.css'
})
export class UserHomePageComponent {

}
