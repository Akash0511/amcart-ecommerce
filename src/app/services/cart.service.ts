import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: Product[] = [{ _id: { $oid: 'abj321' }, id: 1, name: 'Product 1', price: 20, image: '../../assets/images/p1.png', description: 'Description for Product 1', section: 'trandy' },];

  private apiUrl = 'https://ybpri6pdt5.execute-api.us-east-1.amazonaws.com/dev';

  constructor(private http: HttpClient) { }

  addToCart(product: Product) {
    // this.items.push(product);
    const payload = {
      product_id: product.id,
      quantity: 1,
      access_token: localStorage.getItem("accessToken"),
      add_cart: "add_first"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Product added to cart line 29:', payload);
    return this.http.post<any>(`${this.apiUrl}/cart-modification`, payload, { headers: headers })

  }

  delCartItem(product: Product) {
    // this.items.push(product);
    const payload = {
      product_id: product.id,
      quantity: 1,
      access_token: localStorage.getItem("accessToken"),
      add_cart: "del"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/cart-modification`, payload, { headers: headers })

  }

  orderPlaced() {
    // this.items.push(product);
    const payload = {
      access_token: localStorage.getItem("accessToken"),
      add_cart: "order_placed"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/cart-modification`, payload, { headers: headers })

  }

  getCartItems() {
    const payload = {
      access_token: localStorage.getItem("accessToken")
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/get-cart-data`, payload, { headers: headers })
    // console.log('cart service getCartITems() called', this.items)
    // return this.items;
  }

  // clearCart() {
  //   this.items = [];
  //   return this.items;
  // }
}
