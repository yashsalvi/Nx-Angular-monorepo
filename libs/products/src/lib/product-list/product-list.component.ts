import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../product';
import { SharedUiComponent } from '@angular-monorepo/shared-ui';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'angular-monorepo-product-list',
    imports: [CommonModule, FormsModule, SharedUiComponent ],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit  {
     pageTitle: string = 'Product List';
  showImage: boolean = false;
  errorMessage!: string;
  
  _listFilter!: string;


  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  filteredProducts: IProduct[];
  products: IProduct[] = [];



  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  constructor() {
    
    this.products = [
      {
        productId: 100,
        productName: "Ideal Water bottle",
        code: "Id 001",
        releaseDate: "01/01/2018",
        price: 350.35,
        description: "Stainless steel water bottle of Ideal Brand",
        starRating: 3,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51EpktZ6FLL._SX425_.jpg'
      },
      {
        productId: 210,
        productName: "Cisco DeskPhone",
        code: "Cs 2101",
        releaseDate: "01/01/2019",
        price: 332.50,
        description: "VoIP deskphone of Cisco brand",
        starRating: 4,
        imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS14pWiydKIqYWxiQPfI-M1FVUMjmhKlIJpefRHA8CpODYlGsiOxQ76vFUDAExWr8WwghqGDMMLt3e7PrSE3hXB5Gvh9RU07kA0U6YcRGU&usqp=CAc'
      },
      {
        productId: 410,
        productName: "Lenovo Monitor",
        code: "Len 100",
        releaseDate: "01/02/2016",
        price: 10231.50,
        description: "14 Inches LED MOnitor display",
        starRating: 5,
        imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSZXay3sswIDtekwiHaczvAGh7OhcOfK6kgD3ksMDZnZjZseO5us8SRWgzsXpGZ9nbszxupekQbkN005WJktJmO6EJSl4Gkkif97t-jqv_kNvWxIb2QcdReOg&usqp=CAc'
      }

    ];
   
    
    this.filteredProducts = this.products;
    this.listFilter = 'Ideal';
    
  }


  ngOnInit(): void {
    // this._productService.getProducts()
    //         .subscribe(products => {
    //             this.products = products;
    //             this.filteredProducts = this.products;
    //         },
    //             error => this.errorMessage = <any>error);

    

    
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

}
