import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, Category } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    public authService = inject(AuthService);

    products = signal<Product[]>([]);
    categories = signal<Category[]>([]);
    isLoading = signal<boolean>(false);
    searchQuery = signal<string>('');
    selectedCategory = signal<number | null>(null);
    cartItemCount = signal<number>(0);

    filteredProducts = computed(() => {
        let filtered = this.products();
        const query = this.searchQuery().toLowerCase().trim();
        const catId = this.selectedCategory();

        if (query) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        if (catId) {
            filtered = filtered.filter(p => p.category.id === catId);
        }

        return filtered;
    });

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
        this.cartService.cartItems$.subscribe(items => {
            this.cartItemCount.set(items.reduce((sum, item) => sum + item.quantity, 0));
        });
    }

    loadProducts(): void {
        this.isLoading.set(true);
        this.productService.getProducts(100).subscribe({
            next: (products) => {
                this.products.set(products);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.toastService.error('Error al cargar productos');
                console.error('Error loading products:', error);
                this.isLoading.set(false);
            }
        });
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                this.categories.set(categories);
            },
            error: (error) => {
                console.error('Error loading categories:', error);
            }
        });
    }

    onSearch(): void {

    }

    onCategoryChange(): void {

    }

    clearFilters(): void {
        this.searchQuery.set('');
        this.selectedCategory.set(null);
    }

    addToCart(product: Product): void {
        this.cartService.addToCart(product, 1);
        this.toastService.success('Producto agregado al carrito');
    }

    viewProduct(id: number): void {
        this.router.navigate(['/products', id]);
    }

    editProduct(id: number, event: Event): void {
        event.stopPropagation();
        this.router.navigate(['/products/edit', id]);
    }

    deleteProduct(product: Product, event: Event): void {
        event.stopPropagation();

        if (confirm(`¿Estás seguro de eliminar "${product.title}"?`)) {
            this.productService.deleteProduct(product.id).subscribe({
                next: () => {
                    this.toastService.success('Producto eliminado correctamente');
                    this.loadProducts();
                },
                error: (error) => {
                    this.toastService.error('Error al eliminar el producto');
                    console.error('Error deleting product:', error);
                }
            });
        }
    }

    createProduct(): void {
        this.router.navigate(['/products/create']);
    }

    viewCart(): void {
        this.router.navigate(['/cart']);
    }

    logout(): void {
        this.authService.logout();
    }

    getImageUrl(product: Product): string {
        try {
            const images = product.images;
            if (images && images.length > 0) {
                let img = images[0];
                if (img.startsWith('[')) {
                    const parsed = JSON.parse(img);
                    return parsed[0];
                }
                return img;
            }
        } catch (e) {
            console.error('Error parsing product image:', e);
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
    }
}
