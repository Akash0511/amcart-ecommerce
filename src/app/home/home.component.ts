import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Product } from '../models/product.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  subMenuOpen: boolean = false;
  userNameHeading: string = 'Hello, User';
  userEmail: string | null = null;
  access_token: string | null = null;

  constructor(private productService: ProductService, 
    private router: Router,
    private cartService: CartService,
    private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    // this.products = this.productService.getProducts();
    this.productService.getProducts().subscribe(
      (data: any) => {
        // Assign the received data to your component variable
        const body = JSON.parse(data['body']);
        this.products = body;

        this.productService.setProducts(body);
        // console.log(this.trandy_products)
      }
    );


    this.checkForToken();
    // Retrieve user email and token from localStorage 
    this.userEmail = localStorage.getItem('userEmail');
    this.access_token = localStorage.getItem('accessToken');
    console.log('this.userEmail value', this.userEmail)
    console.log('accessToken value: ', localStorage.getItem('accessToken'))
    // this.updateDisplay();
  }

  redirectToLoginSignup(): void {
    // Redirect to Cognito hosted UI login/signup page
    // https://nagp-ecommerce.auth.us-east-1.amazoncognito.com
    window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=https://d3padlje9p8wi2.cloudfront.net/';
    // Make sure to replace 'your-cognito-domain', 'your-client-id', and 'http://localhost:4200' with your actual Cognito configuration.
  }

  addToCart(product: Product) {
    var message = ''
    const isLoggedIn = localStorage.getItem('accessToken');

    if (isLoggedIn == null) {
      // User is not logged in, redirect to login/signup page
      // this.router.navigate(['/']);
      window.location.href = 'https://nagp-ecommerce-2.auth.us-east-1.amazoncognito.com/login?client_id=6m0q9soq1mnf97t73e7r78liha&response_type=token&redirect_uri=https://d3padlje9p8wi2.cloudfront.net/';
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

  redirectToLogout(): void {
    this.userEmail = null; // Update user email variable after logout
    this.access_token = null;
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
  }

  // logout(): void {
  //   console.log('logout clicked')
  // }

}


