import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone: true
})
export class LoaderComponent implements OnInit {

  @Input()
  loaderElementId: string;

  constructor() { }

  ngOnInit(): void {
      this.setLoaderElementId();
  }

  setLoaderElementId() {
    if (!this.loaderElementId) {
      this.loaderElementId = 'main-loader';
    }
  }

}
