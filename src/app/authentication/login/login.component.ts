import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AppStateService } from 'src/app/app-state.service';
import { AuthUtils } from '../../utils/auth.utils';
import { RestService } from 'src/app/http/rest.service';
import { Subscription, Subject } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy{

  error: {title: string, messageList: string[]} = {
    title: '',
    messageList: []
  }

  controlErrorMessage = new Subject<{title: string, messageList: string[]}>();

  loginForm: FormGroup;

  subscriptions: Subscription[] = [];
 
  constructor(
    private pageTitle: Title,
    public appState: AppStateService,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.setPageTitle();

    //listen on error message
    const sub = this.controlErrorMessage.subscribe( 
      (errorData) => this.displayErrorMessage(true, errorData)
    );

    //save subs
    this.subscriptions.push(sub);

    //create login form
    this.loginForm = AuthUtils.buildLoginForm();
  }

  ngAfterViewInit(): void {
    //stop page loading
    WindowUtils.scrollTop();
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );
  }

  onSubmit() {
    console.log(this.loginForm);

    if (!this.loginForm.valid) {
      this.displayErrorMessage(true);
    } else {
      this.displayErrorMessage(false);

      //submit credentials to server to authenticate this client
      this.login();
    }
  }

  setPageTitle() {
    this.pageTitle.setTitle('Login');
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
        this.error.title = 'Invalid Credentials';
        this.error.messageList = ['Please provide correct username and password'];
      }
      this.appState.setSigningUp(false);
    }
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    //create request
    const requestObservable = this.restService.getAuthRequestBuilder().postLogin(email, password);
    const responseHandler = this.restService.getAuthResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub: Subscription =
      requestObservable.subscribe({

        next: (httpResponse: HttpResponse<void>) => {
          responseHandler.postLogin_OK(httpResponse);
        },

        error: (httpErrorResponse: HttpErrorResponse) => {
          responseHandler.postLogin_ERROR(httpErrorResponse, this.controlErrorMessage);
        }

      });

    //save subs
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
