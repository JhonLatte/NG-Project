import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from '@app-shared/interfaces';

@Pipe({
  name: 'cartSum',
  standalone: true,
})
export class CartSumPipe implements PipeTransform {
  transform(cart: Cart): number {
    let sum = 0;

    for (const product of cart.products) {
      sum += product.quantity * product.pricePerQuantity;
    }

    return sum;
  }
}
