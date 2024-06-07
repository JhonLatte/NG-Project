import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Product, Products} from '../interfaces'
import { API_URL } from '@app-shared/consts';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private readonly http = inject(HttpClient);
  readonly baseURL = API_URL;

  getProducts() {
    return this.http.get<Products>(
      `${this.baseURL}/shop/products/all?page_size=50`,
    );
  }
  getProductsForCarousel(){
    return this.http.get<Products>(
      `${this.baseURL}/shop/products/all?page_size=9`,
    );
  }
  getSingleProductById(id: string) {
    return this.http.get<Product>(`${this.baseURL}/shop/products/id/${id}`);
  }
}
