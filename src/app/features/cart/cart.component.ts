import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    private cartService = inject(CartService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    cartItems = signal<CartItem[]>([]);
    total = signal<number>(0);

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems.set(items);
            this.total.set(this.cartService.getCartTotal());
        });
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity > 0) {
            this.cartService.updateQuantity(productId, quantity);
            this.toastService.success('Cantidad actualizada');
        }
    }

    increaseQuantity(item: CartItem): void {
        this.updateQuantity(item.product.id, item.quantity + 1);
    }

    decreaseQuantity(item: CartItem): void {
        if (item.quantity > 1) {
            this.updateQuantity(item.product.id, item.quantity - 1);
        }
    }

    removeItem(productId: number): void {
        this.cartService.removeFromCart(productId);
        this.toastService.success('Producto eliminado del carrito');
    }

    clearCart(): void {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            this.cartService.clearCart();
            this.toastService.info('Carrito vaciado');
        }
    }

    checkout(): void {
        if (this.cartItems().length === 0) {
            this.toastService.warning('El carrito está vacío');
            return;
        }

        // Simular checkout
        this.toastService.success('¡Compra realizada con éxito!');
        this.cartService.clearCart();
        this.router.navigate(['/products']);
    }

    continueShopping(): void {
        this.router.navigate(['/products']);
    }

    getImageUrl(item: CartItem): string {
        try {
            const images = item.product.images;
            if (images && images.length > 0) {
                let img = images[0];
                if (img.startsWith('[')) {
                    const parsed = JSON.parse(img);
                    return parsed[0];
                }
                return img;
            }
        } catch (e) {
            console.error('Error parsing product image in cart:', e);
        }
        return 'https://via.placeholder.com/150?text=No+Image';
    }

    getSubtotal(item: CartItem): number {
        return item.product.price * item.quantity;
    }
}
