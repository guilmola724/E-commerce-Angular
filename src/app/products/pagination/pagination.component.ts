import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { PaginationUtils } from 'src/app/utils/pagination.utils';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ]
})
export class PaginationComponent implements OnInit, OnDestroy {

  maxPage: number = 1;

  currentPage: number = 1;

  subscriptions: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.handlePaginationConfig();
    this.setPaginationConfig();
  }

  handlePaginationConfig() {
    const sub = this.appState.controlPagination.subscribe(
      (paginationConfig: {maxPage: number, currentPage: number}) => {
        //config the pagination template
        this.maxPage = paginationConfig.maxPage;
        this.currentPage = paginationConfig.currentPage;
      }
    );

    this.subscriptions.push(sub);
  }

  setPaginationConfig() {
    const page = PaginationUtils.getSelectedPage(this.activatedRoute.snapshot.queryParams);
    PaginationUtils.emitPaginationConfig(page, this.appState.getProductsTotalCount(), this.appState.controlPagination);
  }

  getArrayOfPages(): any[] {
    return new Array(this.maxPage);
  }

  getPageQueryParam(page: number): {page: number} {
    return { page: page };
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
