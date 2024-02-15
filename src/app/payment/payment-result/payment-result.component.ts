import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppStateService } from 'src/app/app-state.service';
import { ErrorsHandlingService } from 'src/app/errors-handling/errors-handling.service';
import { WindowUtils } from 'src/app/utils/window.utils';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class PaymentResultComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private pageTitle: Title,
    private errorsHandlingService: ErrorsHandlingService,
    private appState: AppStateService
    ) { }

  result: {title: string, description: string} = {
    title: '',
    description: ''
  }

  ngOnInit(): void {
      this.handlePaymentResult();
  }

  ngAfterViewInit(): void {
    //stop page loading
    WindowUtils.scrollTop();
    window.setTimeout( () => this.appState.controlLoading.next(false), 0 );
  }

  handlePaymentResult() {
    const paymentResult = this.activatedRoute.snapshot.params.paymentResult;

    if (paymentResult === 'success') {
      this.result.title = 'Payment successful!';
      this.result.description = 'Your order will be soon shipped!';
    } else if (paymentResult === 'cancel') {
      this.result.title = 'Payment canceled';
      this.result.description = 'Your order will be no further processed';
    } else {
      this.errorsHandlingService.navigateToErrorPage('404');
      return;
    }

    this.setPageTitle(this.result.title);
  }

  setPageTitle(title: string) {
    this.pageTitle.setTitle(title);
  }

}
