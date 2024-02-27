import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  trandy_products: any[] = [];
  just_arrived_products: any[] = [];

  searched_products: any[] = [];
  searchText: string = '';
  // just_arrived_products: Product[] = [];

  subMenuOpen: boolean = false;
  userNameHeading: string = 'Hello, User';
  userEmail: string | null = null;
  access_token: string | null = null;

  constructor(private productService: ProductService, 
    private router: Router,
    private cartService: CartService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    // this.products = this.productService.getProducts();

    // mocked products list
    // this.trandy_products = this.productService.getTrandyProducts();
    // this.just_arrived_products = this.productService.getJustArrivedProducts();


    this.productService.getTrandyProducts().subscribe(
      (data: any) => {
        // Assign the received data to your component variable
        const body = JSON.parse(data['body']);
        this.trandy_products = body;

        this.productService.setTrandyProducts(body);
        // console.log(this.trandy_products)
      }
    );

    this.productService.getJustArrivedProducts().subscribe(
      (data: any) => {
        // Assign the received data to your component variable
        const body = JSON.parse(data['body']);
        this.just_arrived_products = body;

        this.productService.setJustArrivedProducts(body);
        // console.log(body)
      }
    );

    // console.log('inside product component ts: ', this.just_arrived_products)

    this.checkForToken();
    // Retrieve user email and token from localStorage 
    this.userEmail = localStorage.getItem('userEmail');
    this.access_token = localStorage.getItem('accessToken');
    console.log('this.userEmail value', this.userEmail)
  }

  redirectToLoginSignup(): void {
    console.log('login called')
    // Redirect to Cognito hosted UI login/signup page
    // const loginUrl = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=http://localhost:4200/';
    // this.router.navigate([loginUrl]);
    window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=http://localhost:4200/';
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

  viewDetails(productId: number): void {
    console.log('viewDetails clicked', productId)
    this.router.navigate(['/product-details', productId]);
  }

  // Function to retrieve products based on search text
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

  addToCart(product: Product) {
    var message = ''
    const isLoggedIn = localStorage.getItem('accessToken');

    if (isLoggedIn == null) {
      // User is not logged in, redirect to login/signup page
      // this.router.navigate(['/']);
      window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=http://localhost:4200/';
    }
    else{
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
    }
  }

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 4000; // Duration in milliseconds
    config.horizontalPosition = 'end'; // Position at the end of the screen
    config.verticalPosition = 'top'; // Position at the top of the screen

    this._snackBar.open(message, 'Close', config);
  }

  redirectToLogout(): void {
    this.userEmail = null; // Update user email variable after logout
    this.access_token = null;
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
  }
}

