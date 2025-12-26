import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
}

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface CreateProductDto {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
}

export interface UpdateProductDto {
    title?: string;
    price?: number;
    description?: string;
    categoryId?: number;
    images?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = 'https://api.escuelajs.co/api/v1';
    private http = inject(HttpClient);

    getProducts(limit?: number, offset?: number): Observable<Product[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit.toString());
        if (offset) params = params.set('offset', offset.toString());

        return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/products/${id}`);
    }

    createProduct(product: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(`${this.API_URL}/products`, product);
    }

    updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
        return this.http.put<Product>(`${this.API_URL}/products/${id}`, product);
    }

    deleteProduct(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.API_URL}/products/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.API_URL}/categories`);
    }

    searchProducts(query: string): Observable<Product[]> {
        const params = new HttpParams().set('title', query);
        return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
    }

    filterByCategory(categoryId: number): Observable<Product[]> {
        const params = new HttpParams().set('categoryId', categoryId.toString());
        return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
    }

    filterByPrice(minPrice: number, maxPrice: number): Observable<Product[]> {
        const params = new HttpParams()
            .set('price_min', minPrice.toString())
            .set('price_max', maxPrice.toString());
        return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
    }

    uploadFile(file: File): Observable<{ location: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ location: string }>(`${this.API_URL}/files/upload`, formData);
    }
}
