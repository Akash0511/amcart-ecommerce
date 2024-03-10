import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Router } from '@angular/router';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: number = 0;
  product: any = {};
  userNameHeading: string = 'Hello, User';
  userEmail: string | null = null;
  access_token: string | null = null;

  searched_products: any[] = [];
  searchText: string = '';

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private router: Router) {
    // this.route.params.subscribe(params => {
    //   const productId = params['id'];
    //   // Use productId as needed
    // });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // console.log(params['section'])
      this.productId = +params['id'];
      if (params['section'] == 'just-arrived') {
        // console.log('product detail just arrived section')
        this.product = this.productService.getJustArrivedProductById(this.productId);
      }
      else if (params['section'] == 'trandy') {
        this.product = this.productService.getTrandyProductById(this.productId);
      }
      else {
        this.product = this.productService.getProductById(this.productId);
      }

    });

    this.checkForToken();
    // Retrieve user email and token from localStorage 
    this.userEmail = localStorage.getItem('userEmail');
    this.access_token = localStorage.getItem('accessToken');
    console.log('this.userEmail value', this.userEmail)
  }

  addToCart(product: Product) {
    var message = ''
    this.cartService.addToCart(product).subscribe((data: any) => {
      if (data['statusCode'] == 200) {
        message = 'Product added in your cart!!!'
        console.log('message: ', message)
        this.showSnackbar(message);
        // this._snackBar.open('Product added to your cart', 'Close', {
        //   duration: 3000, // Duration in milliseconds
        //   horizontalPosition: 'end', // Position the snack bar
        //   verticalPosition: 'top' // Position the snack bar
        // });
      }
    }
    );
    // console.log('return result: ', message)
    // Implement your logic to add the product to the cart
    // console.log('Product added to cart:', this.product);
  }

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 4000; // Duration in milliseconds
    config.horizontalPosition = 'end'; // Position at the end of the screen
    config.verticalPosition = 'top'; // Position at the top of the screen

    this._snackBar.open(message, 'Close', config);
  }

  redirectToLoginSignup(): void {
    console.log('login called')
    // Redirect to Cognito hosted UI login/signup page
    // https://nagp-ecommerce.auth.us-east-1.amazoncognito.com
    window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=https://d3padlje9p8wi2.cloudfront.net/';
    // Make sure to replace 'your-cognito-domain', 'your-client-id', and 'http://localhost:4200' with your actual Cognito configuration.
  }

  private checkForToken(): void {
    console.log('inside check for token')
    try {
      console.log('inside try of check for token')
      const queryParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = queryParams.get('access_token');

      if (accessToken) {
        console.log(accessToken)
        // Save the token in localStorage or perform the necessary actions
        localStorage.setItem('accessToken', accessToken);
      }

    }
    catch {
      console.log('no token available')
    }

  }

  searchProducts(): void {
    console.log('searchProducts called')
    // const searchUrl = `https://ybpt5.execute-api.us-east-1.amazonaws.com/dev/text-search?search=${this.searchText}`;
    this.productService.getSearchedProducts(this.searchText).subscribe(
      (data: any) => {
        const body = JSON.parse(data['body']);
        this.searched_products = body;
        console.log('search_products retrieved: ', this.searched_products)
      }
    );
  }

  redirectToLogout(): void {
    this.userEmail = null; // Update user email variable after logout
    this.access_token = null;
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
  }


}


