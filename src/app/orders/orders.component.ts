import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Title } from '@angular/platform-browser';
import { OrderItemComponent } from './order-item/order-item.component';
import { PaginationComponent } from '../products/pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    OrderItemComponent,
    PaginationComponent
  ]
})
export class OrdersComponent implements OnInit, AfterViewInit {

  constructor(
    public appState: AppStateService,
    private pageTitle: Title
  ) { }

  ngOnInit(): void {
      this.setPageTitle();
  }

  ngAfterViewInit(): void {
    //stop page loading
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );
  }

  setPageTitle() {
    if (this.appState.isUserAdmin()) {
      this.pageTitle.setTitle('Manage Orders');
    } else {
      this.pageTitle.setTitle('Your Orders');
    }
  }

}
