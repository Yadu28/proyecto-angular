import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    loginForm: FormGroup;
    isLoading = false;
    showPassword = false;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid && !this.isLoading) {
            this.isLoading = true;
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.toastService.success('¡Bienvenido!');
                    this.router.navigate(['/products']);
                },
                error: (error) => {
                    this.toastService.error('Credenciales inválidas. Inténtalo de nuevo.');
                    console.error('Login error:', error);
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        } else {
            Object.keys(this.loginForm.controls).forEach(key => {
                this.loginForm.get(key)?.markAsTouched();
            });
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    getErrorMessage(controlName: string): string {
        const control = this.loginForm.get(controlName);
        if (control?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (control?.hasError('email')) {
            return 'Ingresa un email válido';
        }
        if (control?.hasError('minlength')) {
            return 'La contraseña debe tener al menos 4 caracteres';
        }
        return '';
    }
}
