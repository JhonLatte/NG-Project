import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Product } from '@app-shared/interfaces';
import {
  AlertService,
  CartService,
  ProductsService,
} from '@app-shared/services';
import { BehaviorSubject, EMPTY, catchError, tap} from 'rxjs';
import { ProductPreviewComponent } from '@app-shared/ui';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import FooterComponent from '../footer/footer.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductPreviewComponent, MatPaginatorModule, AsyncPipe, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export default class ProductsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly productsService = inject(ProductsService);
  private readonly alertService = inject(AlertService);
  private readonly cartService = inject(CartService);

  readonly #products$ = new BehaviorSubject<Product[]>([]);
  readonly products$ = this.#products$.asObservable();

  readonly paginatorConfig = {
    length: 0,
    limit: 0,
  };

  constructor() {
    this.loadProducts(1, 5);
  }

  loadProducts(pageIndex: number, pageSize: number) {
    this.productsService
      .getProducts(pageIndex, pageSize)
      .pipe(
        tap((response) => {
          this.#products$.next(response.products);
          this.paginatorConfig.limit = response.limit;
          this.paginatorConfig.length = response.total;
        }),
        catchError((response) => {
          this.alertService.error(response.error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  addToCart(product: Product) {
    if (this.cartService.cart) {
      this.cartService
        .updateCart({
          quantity: 1,
          id: product._id,
        })
        .pipe(
          tap((response) => {
            this.cartService.cart = response;
          }),
        )
        .subscribe();
    } else {
      this.cartService
        .createCart({
          quantity: 1,
          id: product._id,
        })
        .pipe(
          tap((response) => {
            this.cartService.cart = response;
          }),
        )
        .subscribe();
    }

    this.dialog.open(CartComponent, {
      data: product,
      height: '100vh',
      maxWidth: 500,
      minWidth: 280,
      position: {
        top: '0',
        right: '0',
      },
    });
  }
}
