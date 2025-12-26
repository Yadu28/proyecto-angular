import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    public toasts$ = this.toastsSubject.asObservable();
    private idCounter = 0;

    show(message: string, type: ToastType = 'info', duration: number = 3000): void {
        const id = this.idCounter++;
        const toast: Toast = { id, message, type };

        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts, toast]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error');
    }

    warning(message: string): void {
        this.show(message, 'warning');
    }

    info(message: string): void {
        this.show(message, 'info');
    }

    remove(id: number): void {
        const currentToasts = this.toastsSubject.value.filter(toast => toast.id !== id);
        this.toastsSubject.next(currentToasts);
    }
}
