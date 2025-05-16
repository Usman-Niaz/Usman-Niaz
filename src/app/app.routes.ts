import { Routes } from '@angular/router';
import { LoginComponent } from './Features/Admin/login/login.component';
import { ProjectsComponent } from './Features/Admin/projects/projects.component';
import { HeroComponent } from './Features/Admin/hero/hero.component';
import { TestComponentRenderer } from '@angular/core/testing';
import { FeedbackComponent } from './Features/Admin/feedback/feedback.component';
import { IntroComponent } from './Features/Admin/intro/intro.component';
import { ProfileComponent } from './Features/Admin/profile/profile.component';
import { TestimonialComponent } from './Features/Admin/testimonial/testimonial.component';
import { WorkProcessComponent } from './Features/Admin/work-process/work-process.component';
import { ServicesComponent } from './Features/Admin/services/services.component';
import { SkillsComponent } from './Features/Admin/skills/skills.component';
import { ExperienceComponent } from './Features/Admin/experience/experience.component';
import { ShowComponentComponent } from './Features/Admin/show-component/show-component.component';
import { AuthGuard } from './Core/Auth/auth.guard';
import { UserHomePageComponent } from './Features/User/user-home-page/user-home-page.component';
import { ProjectsDetailsComponent } from './Features/User/projects-details/projects-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-home',
    pathMatch: 'full',
  },
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [AuthGuard], // restrict if already logged in
  },
  {
    path: 'admin',
    component: ShowComponentComponent,
    canActivate: [AuthGuard], // restrict if not logged in
    children: [
      { path: 'home', component: HeroComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'hero', component: HeroComponent },
      { path: 'testimonials', component: TestimonialComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'intro', component: IntroComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'work', component: WorkProcessComponent },
      { path: 'service', component: ServicesComponent },
      { path: 'skill', component: SkillsComponent },
      { path: 'experience', component: ExperienceComponent },
    ],
  },{
    path: 'user-home',
    component: UserHomePageComponent,
    children: [
        
    ],
  },
    {
    path: 'project/:id', // ✅ Moved outside so only this component shows
    component: ProjectsDetailsComponent,
  },
];

