import { NgClass, NgIf, NgStyle, Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { GuardService } from 'src/app/http/guards/guard.service';
import { RestService } from 'src/app/http/rest.service';
import { BackArrowIconComponent } from 'src/app/utils/icons/back-arrow-icon/back-arrow-icon.component';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-navigation-items',
  templateUrl: './navigation-items.component.html',
  styleUrls: ['./navigation-items.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    RouterLink,
    BackArrowIconComponent
  ]
})
export class NavigationItemsComponent implements OnInit, OnDestroy {

  @Input()
  isMobileMenu: boolean;

  subscriptions: Subscription[] = [];

  static controlCartRecovery_INIT: boolean = false;

  constructor(
    public appState: AppStateService,
    private restService: RestService,
    private guardService: GuardService,
    private location: Location
  ) { }

  ngOnInit(): void {
      //since this component is instanciated twice (desktop + mobile menu), prevent from subscribing twice to controlCartRecovery subject
      if (!NavigationItemsComponent.controlCartRecovery_INIT) {
        this.controlCartRecovery();
        NavigationItemsComponent.controlCartRecovery_INIT = true;
      }
  }

  closeMobileMenu() { 
    this.appState.setMobileMenu(false);
    WindowUtils.setBodyOverflow('visible');
  }

  logout() {
    //create request
    const requestObservable = this.restService.getAuthRequestBuilder().postLogout();
    const responseHandler = this.restService.getAuthResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub = requestObservable.subscribe({

      next: (httpResponse: HttpResponse<void>) => {
        responseHandler.postLogout_OK(httpResponse);
      },

      error: (httpErrorResponse: HttpErrorResponse) => {
        responseHandler.postLogout_ERROR(httpErrorResponse);
      }

    });

    //save subs
    this.subscriptions.push(sub);
    this.guardService.addSubscriptionFromOutside(sub);
  }

  controlCartRecovery() {
    this.appState.controlCartRecovery.subscribe(
      (dataId: number) => {
        //ask the server to recover the cart from cache after it was destroyed. The cart is then placed in the session again
        const observableRequest = this.restService.getFlashingRequestBuilder().flashCart(dataId);
        const responseHandler = this.restService.getFlashingResponseHandler();

        console.log('SENT FLASH CART REQUEST');

        //send request
        const sub = observableRequest.subscribe({

          next: (httpResponse: HttpResponse<void>) => {
            responseHandler.flashCart_OK(httpResponse);
          },

          error: (httpErrorResponse) => {
            responseHandler.flashCart_ERROR(httpErrorResponse);
          }

        });

        //save subs
        this.subscriptions.push(sub);
        this.guardService.addSubscriptionFromOutside(sub);
      }
    );
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
