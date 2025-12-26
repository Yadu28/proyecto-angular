import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    private cartService = inject(CartService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    cartItems: CartItem[] = [];
    total = 0;

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.total = this.cartService.getCartTotal();
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
        if (this.cartItems.length === 0) {
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
        return item.product.images && item.product.images.length > 0
            ? item.product.images[0]
            : 'https://via.placeholder.com/150?text=No+Image';
    }

    getSubtotal(item: CartItem): number {
        return item.product.price * item.quantity;
    }
}
