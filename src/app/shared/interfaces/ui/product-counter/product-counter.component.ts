import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Cart, Product } from '@app-shared/interfaces';
import { CartProductPipe } from '@app-shared/pipes';
import { AlertService, CartService } from '@app-shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-product-counter',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, CartProductPipe, AsyncPipe],
  templateUrl: './product-counter.component.html',
  styleUrl: './product-counter.component.scss',
})
export class ProductCounterComponent {
  @Input() product: Product | null = null;
  @Output() deleted = new EventEmitter<void>();

  private readonly cartService = inject(CartService);
  private readonly alertService = inject(AlertService);

  readonly cart$ = this.cartService.cart$;

  isDisabled = false;

  counter(count: number) {
    if (!this.product) {
      return;
    }

    this.isDisabled = true;

    if (count === 0) {
      this.cartService
        .removeItemFromCart(this.product._id)
        .pipe(
          tap((cart) => {
            this.cartService.cart = cart;
            this.deleted.emit();
            this.isDisabled = false;
          }),
          catchError((response) => {
            this.alertService.error(response.erorr);
            return EMPTY;
          }),
        )
        .subscribe();
      return;
    }

    if (this.cartService.cart) {
      this.cartService
        .updateCart({
          quantity: count,
          id: this.product._id,
        })
        .pipe(
          tap((response) => {
            this.updateCart(response);
          }),
          catchError((response) => {
            this.alertService.error(response.error);
            return EMPTY;
          }),
        )
        .subscribe();
    } else {
      this.cartService
        .createCart({
          quantity: count,
          id: this.product._id,
        })
        .pipe(
          tap((response) => {
            this.updateCart(response);
          }),
        )
        .subscribe();
    }
  }

  private updateCart(response: Cart) {
    this.cartService.cart = response;
    this.isDisabled = false;
  }
}
