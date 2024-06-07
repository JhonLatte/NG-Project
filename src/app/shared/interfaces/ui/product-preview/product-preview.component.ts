import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@app-shared/interfaces';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TextShorterPipe } from '@app-shared/pipes';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-preview',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TextShorterPipe,
    ProductPriceComponent,
  ],
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.scss',
})
export class ProductPreviewComponent {
  @Input() product: Product | null = null;
  @Input() isCartDisplay: boolean = false;
  @Output() addToCart = new EventEmitter<Product>();

  openCart(product: Product) {
    this.addToCart.emit(product);
  }
}
