import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { NavigationItemsComponent } from './navigation-items/navigation-items.component';
import { NgClass, NgIf, NgStyle, Location } from '@angular/common';
import { BackArrowIconComponent } from '../utils/icons/back-arrow-icon/back-arrow-icon.component';
import { RouterLink } from '@angular/router';
import { WindowUtils } from '../utils/window.utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    NavigationItemsComponent,
    BackArrowIconComponent,
    RouterLink
  ],
})
export class HeaderComponent {

  constructor(
    public appState: AppStateService,
    private location: Location
    ) { }

  toggleMobileMenu(mobileMenuElement: HTMLElement) {
    if (mobileMenuElement.classList.contains('open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  closeMobileMenu() { 
    this.appState.setMobileMenu(false);
    WindowUtils.setBodyOverflow('visible');
  }

  openMobileMenu() { 
    this.appState.setMobileMenu(true);
    WindowUtils.setBodyOverflow('hidden');
  }

  back() {
    this.location.back();
  }

  getMobileActionButtonsMargin(): string {
    return this.appState.getCartLength() !== 0 && !this.appState.isMobileMenuOpen() ? '0' : '1.75rem';
  }

}
