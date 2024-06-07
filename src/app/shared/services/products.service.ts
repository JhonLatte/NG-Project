import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '@app-shared/consts';
import { Product, Products } from '@app-shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = `${API_BASE_URL}/shop/products`;

  getProducts(pageIndex: number = 1, pageSize: number = 5) {
    return this.http.get<Products>(
      `${this.baseUrl}/all?page_size=${pageSize}&page_index=${pageIndex}`,
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.baseUrl}/id/${id}`);
  }
}
