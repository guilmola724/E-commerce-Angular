import { NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StorageReference } from 'firebase/storage';
import { Observable, Subject, Subscription } from 'rxjs';
import { AppStateService } from 'src/app/app-state.service';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { RestService } from 'src/app/http/rest.service';
import { Product } from 'src/app/model/product.model';
import { ProductUtils } from 'src/app/utils/product.utils';

@Component({
  selector: 'app-new-product',
  templateUrl: './handle-product.component.html',
  styleUrls: ['./handle-product.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ]
})
export class HandleProductComponent implements OnInit, AfterViewInit, OnDestroy {

  error: {title: string, messageList: string[]} = {
    title: '',
    messageList: []
  }

  controlErrorMessage = new Subject<{title: string, messageList: string[]}>();

  product: Product;

  imageLocalUrl: string;

  productForm: FormGroup;

  @ViewChild('fileInputRef', {static: true})
  fileInputRef: ElementRef; 

  update: boolean = false; // TRUE = update product, FALSE = Add new product

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public appState: AppStateService,
    private restService: RestService,
    private firebaseService: FirebaseService,
    private pageTitle: Title
    ) { }

  ngOnInit(): void {
    //product form
    this.setProductData();
    this.productForm = ProductUtils.buildHandleProductForm(this.product);

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

  setProductData() {
    const params = this.activatedRoute.snapshot.params;
    const paramsList = Object.keys(params);

    if (paramsList.length === 0) {

      //CASE 1: add new prouct
      this.update = false;

      this.product = new Product(0, '', '', null, '', '');

      this.setPageTitle('Add New Product');

    } else {

      //CASE 2: update product
      this.update = true;

      this.product = ProductUtils.findProductById(+params.productId, this.appState.getProductList());

      this.setPageTitle(this.product.getTitle());

    }
  }

  async onSubmit() {
    console.log(this.productForm);

    if ( !this.inputIsValid() ) {

      this.displayErrorMessage(true);

    } else {

      this.displayErrorMessage(false);

      //start loading
      this.appState.controlLoading.next(true);

      //upload the image only if one is picked bby the file input
      let imageUrl: string = null;

      if (this.productForm.value.image) {
        //try to upload the image
        imageUrl = await this.uploadImage();

        //Failed to upload the image
        if (!imageUrl) {

          this.displayErrorMessage(true, {
            title: 'Failed to upload product image',
            messageList: ['An error occured while uploading the file to Firebase']
          });

          //stop loading
          this.appState.controlLoading.next(false);

          return;
        }
      } 

      //update or add a new product in the shop
      this.saveProduct(imageUrl);

    }
  }

  inputIsValid(): boolean {
    //when we updated a product, it is not necessary to replace the current image
    if (this.update) {
      return this.productForm.valid;
    } else {
      return this.productForm.valid && this.productForm.value.image;
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
                                  'Price field must have the correct format, for example: 19.99, 3.80, 100.9, ...'
                                 ];
        if (this.update) {
        this.error.messageList.unshift('A new image is optional');
        }

      }

    }
  }

  createImagePreview() {
    const fileInputElement = <HTMLInputElement>this.fileInputRef.nativeElement;

    if (!fileInputElement.files.length) {
      this.imageLocalUrl = '';
      return;
    }

    const file = fileInputElement.files[0];

    const localUrl = URL.createObjectURL(file);
    this.imageLocalUrl = localUrl;
  }

  resetValues() {
    this.productForm.reset();
    this.imageLocalUrl = '';
  }

  getPageHeader(): string {
    return this.update ? 'Update This Product' : 'Add a New Product';
  }

  setPageTitle(title: string) {
    this.pageTitle.setTitle(title);
  }

  async uploadImage(): Promise<string> {
    const fileInputElement = <HTMLInputElement>this.fileInputRef.nativeElement;
    const file = fileInputElement.files[0];

    let storageRef: StorageReference;

    try {
      //try to perform the image upload, if it failes then uploadFile() return NULL
      storageRef = await this.firebaseService.uploadFile('product-images', file);
    } catch (error) {
      console.log(error);
    }

    if (storageRef) {
      //upload successsful
      return this.firebaseService.getUrl(storageRef);
    } else {
      return Promise.resolve(null);
    }
    
  }

  saveProduct(imageUrl: string) {
    let requestObservable: Observable<HttpResponse<Product>>; 
    const responseHandler = this.restService.getProductResponseHandler();
    let responseHandlerOk: any;
    let responseHandlerError: any;

    //request data
    const values = this.productForm.value;

    const product = new Product(
      this.update ? this.product.getProductId() : null, //send product id only if we want to update an existing product
      values.title,
      values.summary,
      +values.price, //to number!
      values.description,
      imageUrl
    );

    if (this.update) {
      //update product
      requestObservable = this.restService.getProductRequestBuilder().putProductById(product);
      responseHandlerOk = responseHandler.putProductById_OK.bind(responseHandler);
      responseHandlerError = responseHandler.putProductById_ERROR.bind(responseHandler);
    } else {
      //add new product
      requestObservable = this.restService.getProductRequestBuilder().postProduct(product);
      responseHandlerOk = responseHandler.postProduct_OK.bind(responseHandler);
      responseHandlerError = responseHandler.postProduct_ERROR.bind(responseHandler);
    }

    //send request
    const sub = requestObservable.subscribe({

      next: (httpResponse: HttpResponse<Product>) => {
        responseHandlerOk(httpResponse);
      },

      error: (httpErrorResponse: HttpErrorResponse) => {
        responseHandlerError(httpErrorResponse, this.controlErrorMessage);
      }

    });

    //save subs
    this.subscriptions.push(sub);

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
}

}
