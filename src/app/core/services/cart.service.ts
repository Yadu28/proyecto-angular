import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly STORAGE_KEY = 'shopping_cart';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor() { }

    private loadCart(): CartItem[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    private saveCart(items: CartItem[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        this.cartItemsSubject.next(items);
    }

    addToCart(product: Product, quantity: number = 1): void {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentItems.push({ product, quantity });
        }

        this.saveCart(currentItems);
    }

    removeFromCart(productId: number): void {
        const currentItems = this.cartItemsSubject.value.filter(
            item => item.product.id !== productId
        );
        this.saveCart(currentItems);
    }

    updateQuantity(productId: number, quantity: number): void {
        const currentItems = this.cartItemsSubject.value;
        const item = currentItems.find(item => item.product.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(currentItems);
            }
        }
    }

    clearCart(): void {
        this.saveCart([]);
    }

    getCartItems(): CartItem[] {
        return this.cartItemsSubject.value;
    }

    getCartItemCount(): number {
        return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
    }

    getCartTotal(): number {
        return this.cartItemsSubject.value.reduce(
            (total, item) => total + (item.product.price * item.quantity),
            0
        );
    }
}
