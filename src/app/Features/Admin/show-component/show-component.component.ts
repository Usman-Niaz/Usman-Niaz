import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsidbarComponent } from "../../../Shared/asidbar/asidbar.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-show-component',
  imports: [RouterOutlet, AsidbarComponent, CommonModule, HeaderComponent],
  templateUrl: './show-component.component.html',
  styleUrl: './show-component.component.css'
})
export class ShowComponentComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
}
