import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        const isGuest = authService.isGuest();
        const url = state.url;

        // invitado solo puede ver productos
        if (isGuest) {
            // validaciones de rutas restringidas
            if (url.includes('/create') || url.includes('/edit/') || url === '/cart') {
                router.navigate(['/products']);
                return false;
            }
        }

        return true;
    }

    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
