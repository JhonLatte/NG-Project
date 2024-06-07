import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CartItem, CartProduct, Product } from '@app-shared/interfaces';
import {
  ProductCounterComponent,
  ProductPreviewComponent,
} from '@app-shared/ui';
import { AlertService, CartService } from '@app-shared/services';
import { AsyncPipe } from '@angular/common';
import { CartSumPipe, ProductPipe } from '@app-shared/pipes';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ProductPreviewComponent,
    ProductCounterComponent,
    AsyncPipe,
    ProductPipe,
    CartSumPipe,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly cartService = inject(CartService);
  private readonly aletService = inject(AlertService);

  product = inject<Product | null>(DIALOG_DATA);
  readonly cart$ = this.cartService.cart$;

  close() {
    this.dialogRef.close();
  }

  removeFromCart(cartProduct: CartProduct) {
    this.cartService
      .removeItemFromCart(cartProduct.productId)
      .pipe(
        tap((cart) => {
          this.cartService.cart = cart;
          this.product = null;
        }),
        catchError((response) => {
          this.aletService.error(response.erorr);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  checkout() {
    this.cartService.checkout().subscribe((res) => {
      if (res.success) {
        this.aletService.alert('Succesfully checkout', 'success');
        this.dialogRef.close();
        this.cartService.cart = null;
      }
    });
  }
}
