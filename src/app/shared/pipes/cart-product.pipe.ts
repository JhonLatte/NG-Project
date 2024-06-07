import { Pipe, PipeTransform } from '@angular/core';
import { CartProduct } from '@app-shared/interfaces';

@Pipe({
  name: 'cartProduct',
  standalone: true,
})
export class CartProductPipe implements PipeTransform {
  transform(products: CartProduct[], id: string): CartProduct | undefined {
    return products.find((product) => product.productId === id);
  }
}
