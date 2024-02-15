import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppStateService } from 'src/app/app-state.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { GuardService } from 'src/app/http/guards/guard.service';
import { Subscription } from 'rxjs';
import { PaginationUtils } from 'src/app/utils/pagination.utils';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ProductItemComponent,
    PaginationComponent
  ]
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  title: string = '';

  componentLoaded: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public appState: AppStateService,
    private pageTitle: Title,
    private guardService: GuardService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    //set title
    this.setTitles();

    //listen on query params (selected page)
    this.handleSelectedPage();
  }

  ngAfterViewInit(): void {
    //stop page loading
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );

    //component
    this.componentLoaded = true;
  }

  handleSelectedPage() {
    const sub = this.activatedRoute.queryParams.subscribe(
      (queryParams: Params) => {

        if (this.componentLoaded) {
          const page = PaginationUtils.getSelectedPage(queryParams);

          //load products of the selected page
          this.guardService.cancelSubscriptionsFromOutside(); //cancel previous guard requests
          
          this.guardService.getProductGuard().getProducts(page, false);
        }

      }
    );

    this.subscriptions.push(sub);
  }

  setTitles() {
    if (this.appState.isUserAdmin()) {
      this.title = 'Manage Products';
    } else {
      this.title = "What's New?";
    }
    this.pageTitle.setTitle(this.title);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
