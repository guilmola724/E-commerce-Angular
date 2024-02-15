import { Component, HostListener } from '@angular/core';
import { AppStateService } from './app-state.service';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './animations/loader/loader.component';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WindowUtils } from './utils/window.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    HeaderComponent,
    LoaderComponent,
  ]
})
export class AppComponent{
  
  constructor(public appState: AppStateService) { }

  @HostListener('window-resize')
  onWindowResize() {
    if (window.innerWidth >= 900) {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    this.appState.setMobileMenu(false);
    WindowUtils.setBodyOverflow('visible');
  }

}
