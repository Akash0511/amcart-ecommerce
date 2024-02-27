import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private just_arrived_products: Product[] = [];
  private trandy_products: Product[] = [];
  private products: Product[] = [];

  // just_arrived_data: any[] = [];
  private apiUrl = 'https://ybpri6pdt5.execute-api.us-east-1.amazonaws.com/dev';

  // private products = [
  //   { id: 1, name: 'Product 1', price: 20, image: '../../assets/images/p1.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 2, name: 'Product 2', price: 20, image: '../../assets/images/p2.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 3, name: 'Product 1', price: 20, image: '../../assets/images/p3.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 4, name: 'Product 2', price: 20, image: '../../assets/images/p4.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 5, name: 'Product 1', price: 20, image: '../../assets/images/p5.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 6, name: 'Product 2', price: 20, image: '../../assets/images/p6.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 7, name: 'Product 1', price: 20, image: '../../assets/images/p7.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 8, name: 'Product 2', price: 20, image: '../../assets/images/p8.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 9, name: 'Product 1', price: 20, image: '../../assets/images/p9.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 10, name: 'Product 2', price: 20, image: '../../assets/images/p10.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 11, name: 'Product 1', price: 20, image: '../../assets/images/p11.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 12, name: 'Product 2', price: 20, image: '../../assets/images/p12.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 13, name: 'Product 13', price: 20, image: '../../assets/images/p10.png', description: 'Description for Product 2', section: 'trandy' },
  //   { id: 14, name: 'Product 14', price: 20, image: '../../assets/images/p11.png', description: 'Description for Product 1', section: 'trandy' },
  //   { id: 15, name: 'Product 15', price: 20, image: '../../assets/images/p12.png', description: 'Description for Product 2', section: 'trandy' },
  //   // Add more products as needed
  // ];

  // private just_arrived_products = [
  //   { id: 1, name: 'Product 1', price: 20, image: '../../assets/images/product-1.jpg', description: 'Description for Product 1', section: 'just-arrived' },
  //   { id: 2, name: 'Product 2', price: 20, image: '../../assets/images/product-2.jpg', description: 'Description for Product 2', section: 'just-arrived' },
  //   { id: 3, name: 'Product 1', price: 20, image: '../../assets/images/product-3.jpg', description: 'Description for Product 1', section: 'just-arrived' },
  //   { id: 4, name: 'Product 2', price: 20, image: '../../assets/images/product-4.jpg', description: 'Description for Product 2', section: 'just-arrived' },
  //   { id: 5, name: 'Product 1', price: 20, image: '../../assets/images/product-5.jpg', description: 'Description for Product 1', section: 'just-arrived' },
  //   { id: 6, name: 'Product 2', price: 20, image: '../../assets/images/product-6.jpg', description: 'Description for Product 2', section: 'just-arrived' },
  //   { id: 7, name: 'Product 1', price: 20, image: '../../assets/images/product-7.jpg', description: 'Description for Product 1', section: 'just-arrived' },
  //   { id: 8, name: 'Product 2', price: 20, image: '../../assets/images/product-8.jpg', description: 'Description for Product 2', section: 'just-arrived' },
  //   // Add more products as needed
  // ];

  constructor(private http: HttpClient) { }

  getSearchedProducts(searchText: string): any{
    return this.http.get<any>(`${this.apiUrl}/text-search?search=${searchText}`)
  }
  
  getProducts(): any {
    // return this.products;
    return this.http.get<any>(`${this.apiUrl}/getproducts?section=trendy`)
  }

  getTrandyProducts(): any {
    // return this.products;
    return this.http.get<any>(`${this.apiUrl}/getproducts?section=trendy`)

  }

  getJustArrivedProducts(): any {
    // return this.just_arrived_products
    return this.http.get<any>(`${this.apiUrl}/getproducts?section=just-arrived`)

  }

  getProductById(id: number): any {
    // return this.products.find(product => product.id === id);
    return this.products.find(product => product.id === id);
  }

  getJustArrivedProductById(id: number): any {
    return this.just_arrived_products.find(product => product.id === id);
  }

  getTrandyProductById(id: number): any {
    return this.trandy_products.find(product => product.id === id);
  }

  setJustArrivedProducts(justarrivedproducts: Product[]): void {
    console.log('inside setJustArrivedProducts')
    this.just_arrived_products = justarrivedproducts;
  }

  setTrandyProducts(trandyproducts: Product[]): void {
    console.log('inside settrandyProducts')
    this.trandy_products = trandyproducts;
  }

  setProducts(products: Product[]): void {
    console.log('inside setProducts')
    this.products = products;
  }

}


