import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductPrice } from '@app-shared/interfaces';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-price',
  standalone: true,
  imports: [TranslateModule, MatIconModule, NgStyle,],
  templateUrl: './product-price.component.html',
  styleUrl: './product-price.component.scss',
})
export class ProductPriceComponent {
  @Input() productPrice: ProductPrice | null = null;
  @Input() center: boolean = false;
}
