import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { RestService } from 'src/app/http/rest.service';
import { CartItem } from 'src/app/model/cart-item.model';
import { FormatPricePipe } from 'src/app/pipes/format-price.pipe';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [
    FormatPricePipe,
    RouterLink
  ]
})
export class CartItemComponent implements OnDestroy {

  @Input()
  cartItem: CartItem;

  @ViewChild('quantityRef', {static: true}) quantityRef: ElementRef;

  @ViewChild('cartItemRef', {static: true}) cartItemRef: ElementRef;

  subscriptions: Subscription[] = [];

  constructor(
    private restService: RestService,
    private appState: AppStateService
    ) { }

  saveCartItem(increment: string) {
    const productId = this.cartItemRef.nativeElement.dataset.productId;
    const quantity = +this.quantityRef.nativeElement.value;

    const cartItem = {
      productId: productId,
      quantity: quantity
    }

    //build request
    const requestObservable = this.restService.getCartRequestBuilder().postCartItem(cartItem, increment);
    const responseHandler = this.restService.getCartResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub: Subscription =
      requestObservable.subscribe({

        next: (httpResponse: HttpResponse<CartItem>) => {
          responseHandler.postCartItem_OK(httpResponse);
        },

        error: (httpErrorResponse: HttpErrorResponse) => {
          responseHandler.postCartItem_ERROR(httpErrorResponse);
        }

      });

      //save subs
      this.subscriptions.push(sub);
  }

  deleteCartItem() {
    const productId = this.cartItemRef.nativeElement.dataset.productId;

    //build request
    const requestObservable = this.restService.getCartRequestBuilder().deleteCartItemById(productId);
    const responseHandler = this.restService.getCartResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub: Subscription =
      requestObservable.subscribe({

        next: (httpResponse: HttpResponse<{productId: number}>) => {
          responseHandler.deleteCartItemById_OK(httpResponse);
        },

        error: (httpErrorResponse: HttpErrorResponse) => {
          responseHandler.deleteCartItemById_ERROR(httpErrorResponse);
        }
  
      });

      //save subs
      this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
