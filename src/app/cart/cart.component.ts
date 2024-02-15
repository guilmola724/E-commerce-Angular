import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Title } from '@angular/platform-browser';
import { CartItemComponent } from './cart-item/cart-item.component';
import { FormatPricePipe } from '../pipes/format-price.pipe';
import { PaginationComponent } from '../products/pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { RestService } from '../http/rest.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Order } from '../model/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    CartItemComponent,
    PaginationComponent,
    FormatPricePipe,
    RouterLink
  ]
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy{

  error: {title: string, messageList: string[]} = {
    title: '',
    messageList: []
  }

  controlErrorMessage = new Subject<{title: string, messageList: string[]}>();

  subscriptions: Subscription[] = [];

  constructor (
    public appState: AppStateService,
    private pagetTitle: Title,
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
  }

  ngAfterViewInit(): void {
    //stop page loading
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );
  }

  placeOrder() {
    this.displayErrorMessage(false);

    //create request
    const requestObservable = this.restService.getOrderRequestBuilder().postOrder();
    const responseHandler = this.restService.getOrderResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub = requestObservable.subscribe({

      next: (httpResponse: HttpResponse<Order>) => {
        responseHandler.postOrder_OK(httpResponse);
      },

      error: (httpErrorResponse: HttpErrorResponse) => {
        responseHandler.postOrder_ERROR(httpErrorResponse, this.controlErrorMessage);
      }

    });

    //save subs
    this.subscriptions.push(sub);
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
        this.error.title = 'Error';
        this.error.messageList = ['An unexpected error occured'];
      }
    }
  }

  setPageTitle() {
    this.pagetTitle.setTitle('Your Cart');
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
