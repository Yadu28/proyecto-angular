import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private toastService = inject(ToastService);
    public authService = inject(AuthService);

    product = signal<Product | undefined>(undefined);
    isLoading = signal<boolean>(true);
    currentImageIndex = signal<number>(0);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id && !isNaN(+id)) {
                this.loadProduct(+id);
            } else {
                this.toastService.error('ID de producto no válido');
                this.router.navigate(['/products']);
            }
        });
    }

    loadProduct(id: number): void {
        this.isLoading.set(true);
        this.product.set(undefined);

        this.productService.getProduct(id).subscribe({
            next: (product) => {
                if (product) {
                    this.product.set(product);
                    this.currentImageIndex.set(0);
                    this.isLoading.set(false);
                } else {
                    this.handleLoadError('Producto no encontrado');
                }
            },
            error: (error) => {
                this.handleLoadError('Error al cargar el producto. Inténtalo de nuevo.');
                console.error('Error loading product:', error);
            }
        });
    }

    private handleLoadError(message: string): void {
        this.toastService.error(message);
        this.isLoading.set(false);
        setTimeout(() => {
            this.router.navigate(['/products']);
        }, 3000);
    }

    getImageUrl(index?: number): string {
        const prod = this.product();
        if (!prod) return '';
        try {
            const images = prod.images;
            if (images && images.length > 0) {
                // Handle JSON string formatted images if applicable
                if (images[0].startsWith('[')) {
                    const parsed = JSON.parse(images[0]);
                    return parsed[index ?? this.currentImageIndex()] || parsed[0];
                }
                // Standard array of URLs
                return images[index ?? this.currentImageIndex()] || images[0];
            }
        } catch (e) {
            console.error('Error parsing product image:', e);
        }
        return 'https://via.placeholder.com/600?text=No+Image';
    }

    setCurrentImage(index: number): void {
        this.currentImageIndex.set(index);
    }

    addToCart(): void {
        const prod = this.product();
        if (prod) {
            this.cartService.addToCart(prod);
            this.toastService.success('Producto agregado al carrito');
        }
    }

    editProduct(): void {
        const prod = this.product();
        if (prod) {
            this.router.navigate(['/products/edit', prod.id]);
        }
    }

    deleteProduct(): void {
        const prod = this.product();
        if (prod && confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.productService.deleteProduct(prod.id).subscribe({
                next: () => {
                    this.toastService.success('Producto eliminado correctamente');
                    this.router.navigate(['/products']);
                },
                error: (error) => {
                    this.toastService.error('Error al eliminar el producto');
                    console.error('Error deleting product:', error);
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/products']);
    }
}
