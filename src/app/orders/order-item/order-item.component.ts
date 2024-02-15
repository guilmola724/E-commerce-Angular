import { NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { RestService } from 'src/app/http/rest.service';
import { Order } from 'src/app/model/order.model';
import { FormatPricePipe } from 'src/app/pipes/format-price.pipe';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormatPricePipe
  ]
})
export class OrderItemComponent implements OnDestroy {

  subscriptions: Subscription[] = [];

  constructor(
    public appState: AppStateService,
    private restService: RestService
    ) { }

  @Input()
  order: Order;

  hasStatus(status: string): boolean {
    return this.order.getStatus() === status;
  }

  updateStatus(newStatus: string) {
    const data = {
      status: newStatus
    }

    const orderId = this.order.getOrderId();

    //create request
    const requestObservable = this.restService.getOrderRequestBuilder().putOrderById(data, orderId);
    const responseHandler = this.restService.getOrderResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub = requestObservable.subscribe({

        next: (httpResponse: HttpResponse<{orderId: number, status: string}>) => {
          responseHandler.putOrderById_OK(httpResponse, this.order);
        },

        error: (httpErrorResponse: HttpErrorResponse) => {
          responseHandler.putOrderById_ERROR(httpErrorResponse);
        }

    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
