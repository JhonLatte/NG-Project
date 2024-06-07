import { Pipe, PipeTransform, inject } from '@angular/core';
import { Product } from '@app-shared/interfaces';
import { ProductsService } from '@app-shared/services';
import { Observable } from 'rxjs';

@Pipe({
  name: 'product',
  standalone: true,
})
export class ProductPipe implements PipeTransform {
  private readonly productService = inject(ProductsService);

  transform(id: string): Observable<Product | null> {
    return this.productService.getProductById(id);
  }
}
