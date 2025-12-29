import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

    private readonly categoryTranslations: Record<string, string> = {
        'Clothes': 'Ropa',
        'Electronics': 'Electrónica',
        'Furniture': 'Muebles',
        'Shoes': 'Zapatos',
        'Miscellaneous': 'Varios',
        'Others': 'Otros',
        'Toys': 'Juguetes',
        'Home': 'Hogar',
        'Appliances': 'Electrodomésticos',
        'Books': 'Libros',
        'Beauty': 'Belleza',
        'Sports': 'Deportes',
        'Updated Category Name': 'Categoría Actualizada',
        'category_B': 'Categoría B',
        'string': 'Genérico',
        'test': 'Prueba',
        'default': 'Por defecto'
    };

    private translateCategory(category: Category): Category {
        if (!category) return category;
        return {
            ...category,
            name: this.categoryTranslations[category.name] || category.name
        };
    }

    private translateProduct(product: Product): Product {
        if (!product || !product.category) return product;
        return {
            ...product,
            category: this.translateCategory(product.category)
        };
    }

    getProducts(limit?: number, offset?: number): Observable<Product[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit.toString());
        if (offset) params = params.set('offset', offset.toString());

        return this.http.get<Product[]>(`${this.API_URL}/products`, { params }).pipe(
            map(products => products.map(p => this.translateProduct(p)))
        );
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/products/${id}`).pipe(
            map(product => this.translateProduct(product))
        );
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
        return this.http.get<Category[]>(`${this.API_URL}/categories`).pipe(
            map(categories => categories.map(c => this.translateCategory(c)))
        );
    }

    searchProducts(query: string): Observable<Product[]> {
        const params = new HttpParams().set('title', query);
        return this.http.get<Product[]>(`${this.API_URL}/products`, { params }).pipe(
            map(products => products.map(p => this.translateProduct(p)))
        );
    }

    filterByCategory(categoryId: number): Observable<Product[]> {
        const params = new HttpParams().set('categoryId', categoryId.toString());
        return this.http.get<Product[]>(`${this.API_URL}/products`, { params }).pipe(
            map(products => products.map(p => this.translateProduct(p)))
        );
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
