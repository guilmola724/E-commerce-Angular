import { NgIf } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { AppStateService } from 'src/app/app-state.service';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-general-error',
  templateUrl: './general-error.component.html',
  styleUrls: ['./general-error.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ]
})
export class GeneralErrorComponent implements OnInit, AfterViewInit {

  error: {title: string, description: string, code: string} = {
    title: '',
    description: '',
    code: ''
  }

  initDone: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pageTitle: Title,
    private appState: AppStateService
    ) { }


  ngOnInit(): void {
    //listen on error-code path parameter
    this.activatedRoute.params.subscribe(
      (params: Params) => {
          this.handleErrorInfo(params);

          if (this.initDone) {
            window.setTimeout( () => this.appState.controlLoading.next(false), 0);
          }
      });

    //init done
    this.initDone = true;

  }

  ngAfterViewInit(): void {
    WindowUtils.scrollTop();
    window.setTimeout( () => this.appState.controlLoading.next(false), 0);
  }

  handleErrorInfo(params: Params) {
    const errorCode = params.errorCode;

    this.error.code = errorCode;

    if (errorCode === '500') {

      this.error.title = 'General Server Error 500';
      this.error.description = 'Ooops... A general server error occured. Please try again later';

    } else if (errorCode === '401') {

      this.error.title = 'Not Authenticated 401';
      this.error.description = 'You should authenticate to access this resource';

    } else if (errorCode === '403') {

      this.error.title = 'Not Authorized 403';
      this.error.description = 'You are not authorized to access this resource';

    } else if (errorCode === 'connection-error') {

      this.error.title = 'It was not possible to connect to the server';
      this.error.description = 'Please check your internet connection and try again'

    } else {

      this.error.title = 'Not Found 404';
      this.error.description = 'The requested resource does not exist';

    }

    this.setPageTitle(this.error.title);
  }

  setPageTitle(title: string) {
    this.pageTitle.setTitle(title);
  }

}
