import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '@app-shared/consts';
import { Cart, CartItem } from '@app-shared/interfaces';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = `${API_BASE_URL}/shop/cart`;

  readonly #cart$ = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this.#cart$.asObservable();

  get cart() {
    return this.#cart$.value;
  }

  set cart(cart: Cart | null) {
    this.#cart$.next(cart);
  }

  init() {
    this.getCart()
      .pipe(
        tap((resposne) => {
          this.cart = resposne;
        }),
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getCart() {
    return this.http.get<Cart>(this.baseUrl);
  }

  createCart(cartItem: CartItem) {
    return this.http.post<Cart>(`${this.baseUrl}/product`, { ...cartItem });
  }

  updateCart(cartItem: CartItem) {
    return this.http.patch<Cart>(`${this.baseUrl}/product`, { ...cartItem });
  }

  removeItemFromCart(id: string) {
    return this.http.delete<Cart>(`${this.baseUrl}/product`, {
      body: {
        id,
      },
    });
  }

  clearCart() {
    return this.http.delete<{ success: boolean }>(this.baseUrl);
  }

  checkout() {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/checkout`, {});
  }
}
