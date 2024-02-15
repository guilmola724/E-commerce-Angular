import { NgIf } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { AppStateService } from 'src/app/app-state.service';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [NgIf]
})
export class AccountComponent implements AfterViewInit {

  constructor(public appState: AppStateService) { }

  ngAfterViewInit(): void {
    WindowUtils.scrollTop();
  }

}
