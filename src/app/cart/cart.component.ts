import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartProduct } from '../models/cartproduct.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Product[] = [];

  cartProducts: CartProduct[] = [];

  totalPrice: number = 0;
  subTotalPrice: number = 0;

  userNameHeading: string = 'Hello, User';
  userEmail: string | null = null;
  access_token: string | null = null;

  searched_products: any[] = [];
  searchText: string = '';

  constructor(private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    // Fetch cart items from ProductService or any other source
    // this.cartItems = this.cartService.getCartItems();

    this.cartService.getCartItems().subscribe((data: any) => {
      const body = JSON.parse(data['body']);
      this.cartProducts = body;
      console.log('cart products are here: ', this.cartProducts)
      this.getTotalPrice()
    }
    );

    console.log('check for cart items in cart component', this.cartItems)

    this.checkForToken();
    // Retrieve user email and token from localStorage 
    this.userEmail = localStorage.getItem('userEmail');
    this.access_token = localStorage.getItem('accessToken');
    console.log('this.userEmail value', this.userEmail)
  }

  incrementQuantity(product: CartProduct): void {
    // Update the quantity of the specified product locally
    product.quantity++;
    // Optionally, you can call a method to update the total price
    this.getTotalPrice()
  }

  decrementQuantity(product: CartProduct): void {
    if (product.quantity > 1) {
      // Decrement the quantity of the specified product locally
      product.quantity--;
      // Optionally, you can call a method to update the total price
    }
    this.getTotalPrice()
  }

  removeProduct(product: CartProduct): void {
    // Find the index of the product in the cartProducts array
    const index = this.cartProducts.indexOf(product);
    if (index !== -1) {
      // Remove the product from the cartProducts array
      this.cartProducts.splice(index, 1);
    }
    this.getTotalPrice()
    // api call to delete cart item
    this.cartService.delCartItem(product).subscribe((data: any) => {
      console.log(data)
    }
    );
  }


  private getTotalPrice(): void {
    let subTotalPrice = 0;
    for (const product of this.cartProducts) {
      subTotalPrice += product.price * product.quantity;
    }
    this.subTotalPrice = subTotalPrice;
    this.totalPrice = this.subTotalPrice + (this.subTotalPrice * 0.025)
  }

  redirectToLoginSignup(): void {
    console.log('login called')
    // Redirect to Cognito hosted UI login/signup page
    // https://nagp-ecommerce.auth.us-east-1.amazoncognito.com
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

  checkout(): void {
    // Redirect the user to the "/product" route
    // this.router.navigate(['/product']);

    var message = ''
    // Display the snackbar message

    this.cartService.orderPlaced().subscribe((data: any) => {
      if (data['statusCode'] == 200) {
        message = 'Order placed successfully, Happy Shopping!!!'
        console.log('message: ', message)
        this.showSnackbar(message);
      }
    }
    );

    // this.showSnackbar(message);
    // this.snackBar.open('Order placed successfully', 'Close', {
    //   duration: 3000, // Display duration in milliseconds
    //   horizontalPosition: 'end', // Position at the end of the screen
    //   verticalPosition: 'top' // Position at the top of the screen
    // });
  }

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // Duration in milliseconds
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
