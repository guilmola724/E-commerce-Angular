import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AuthUtils } from '../../utils/auth.utils';
import { RestService } from 'src/app/http/rest.service';
import { Address } from 'src/app/model/address.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { UserData } from 'src/app/model/user-data.model';
import { InputValidation } from 'src/app/enum/validation.enum';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ReactiveFormsModule
  ]
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {

  error: {title: string, messageList: string[]} = {
    title: '',
    messageList: []
  }

  controlErrorMessage = new Subject<{title: string, messageList: string[]}>();

  signupForm: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    private pageTitle: Title,
    private restService: RestService,
    private appState: AppStateService
  ) { }

  ngOnInit(): void {
    this.setPageTitle();

    //listen on error message
    const sub = this.controlErrorMessage.subscribe( 
      (errorData) => this.displayErrorMessage(true, errorData)
    );

    //save subs
    this.subscriptions.push(sub);

    //create signup form
    this.signupForm = AuthUtils.buildSignupForm();
  }

  ngAfterViewInit() {
    WindowUtils.scrollTop();
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );
  }

  onSubmit() {
    console.log(this.signupForm);

    if (!this.signupForm.valid) {
      this.displayErrorMessage(true);
    } else {
      this.displayErrorMessage(false);

      //submit form data to server to register a new user account
      this.createUserAccount();
    }
  }

  displayErrorMessage(display: boolean, errorData?: {title: string, messageList: string[]}) {
    if (!display) {
      this.error.title = '';
      this.error.messageList = [];
    } else {
      if (errorData) {
        this.error.title = errorData.title;
        this.error.messageList = errorData.messageList;
      } else {
        this.error.title = 'Invalid input';
        this.error.messageList = [
                                  'All the data must be entered',
                                  'Passsword min length is ' + InputValidation.passwordMinLength,
                                  'Be sure to enter your full name in the format "Name Surname"'
                                 ];
      }
      //scroll to top of page to make sure user sees the error message
      WindowUtils.scrollTop();
    }
  }

  setPageTitle() {
    this.pageTitle.setTitle('Signup');
  }

  createUserAccount() {
    const values = this.signupForm.value;

    const address = new Address(
      0,
      values.street,
      values.postal,
      values.city
    );

    const userData = new UserData(
      values.email,
      values['confirm-email'],
      values.password,
      values['fullname'],
      address
    );

    //build request
    const requestObservable = this.restService.getAuthRequestBuilder().postSignup(userData);
    const responseHandler = this.restService.getAuthResponseHandler();

    //start page loading
    this.appState.controlLoading.next(true);

    //send request
    const sub: Subscription = 
      requestObservable.subscribe({

          next: (httpResponse: HttpResponse<void>) => {
            responseHandler.postSignup_OK(httpResponse);
          },

          error: (httpErrorResponse: HttpErrorResponse) => {
            responseHandler.postSignup_ERROR(httpErrorResponse, this.controlErrorMessage);
          }

      });

    //save subs
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
