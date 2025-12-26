import { Component, OnInit, inject } from '@angular/core';
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
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    public authService = inject(AuthService);

    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    isLoading = false;
    searchQuery = '';
    selectedCategory: number | null = null;
    cartItemCount = 0;

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
        this.cartService.cartItems$.subscribe(items => {
            this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        });
    }

    loadProducts(): void {
        this.isLoading = true;
        this.productService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.filteredProducts = products;
                this.isLoading = false;
            },
            error: (error) => {
                this.toastService.error('Error al cargar productos');
                console.error('Error loading products:', error);
                this.isLoading = false;
            }
        });
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (error) => {
                console.error('Error loading categories:', error);
            }
        });
    }

    onSearch(): void {
        this.applyFilters();
    }

    onCategoryChange(): void {
        this.applyFilters();
    }

    applyFilters(): void {
        let filtered = this.products;

        // Filter by search query
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (this.selectedCategory) {
            filtered = filtered.filter(product => product.category.id === this.selectedCategory);
        }

        this.filteredProducts = filtered;
    }

    clearFilters(): void {
        this.searchQuery = '';
        this.selectedCategory = null;
        this.filteredProducts = this.products;
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
        return product.images && product.images.length > 0
            ? product.images[0]
            : 'https://via.placeholder.com/400x300?text=No+Image';
    }
}
