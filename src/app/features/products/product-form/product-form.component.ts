import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Category } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private productService = inject(ProductService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);

    productForm: FormGroup;
    categories: Category[] = [];
    isEditMode = false;
    productId?: number;
    isLoading = false;
    isSubmitting = false;
    isUploading = false;

    constructor() {
        this.productForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            price: ['', [Validators.required, Validators.min(1)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            categoryId: ['', Validators.required],
            images: this.fb.array([this.fb.control('', Validators.required)])
        });
    }

    ngOnInit(): void {
        this.loadCategories();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.productId = +params['id'];
                this.loadProduct(this.productId);
            }
        });
    }

    get images(): FormArray {
        return this.productForm.get('images') as FormArray;
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (error) => {
                this.toastService.error('Error al cargar categorías');
                console.error('Error loading categories:', error);
            }
        });
    }

    loadProduct(id: number): void {
        this.isLoading = true;
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    categoryId: product.category.id
                });

                // Clear and populate images
                this.images.clear();
                if (product.images && product.images.length > 0) {
                    product.images.forEach(image => {
                        this.images.push(this.fb.control(image, Validators.required));
                    });
                } else {
                    this.images.push(this.fb.control('', Validators.required));
                }

                this.isLoading = false;
            },
            error: (error) => {
                this.toastService.error('Error al cargar el producto');
                console.error('Error loading product:', error);
                this.isLoading = false;
                this.router.navigate(['/products']);
            }
        });
    }

    addImageField(): void {
        this.images.push(this.fb.control('', Validators.required));
    }

    onFileSelected(event: any, index: number): void {
        const file = event.target.files[0];
        if (file) {
            // Show preview immediately using local URL or reader
            const reader = new FileReader();
            reader.onload = () => {
                // We could use this as a temporary preview, but let's just upload
            };
            reader.readAsDataURL(file);

            this.isUploading = true; // Block submit during upload
            this.productService.uploadFile(file).subscribe({
                next: (response) => {
                    this.images.at(index).setValue(response.location);
                    this.isUploading = false;
                },
                error: (error) => {
                    this.toastService.error('Error al subir la imagen');
                    console.error('Upload error:', error);
                    this.isUploading = false;
                }
            });
        }
    }

    removeImageField(index: number): void {
        if (this.images.length > 1) {
            this.images.removeAt(index);
        }
    }

    onSubmit(): void {
        if (this.productForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const formValue = this.productForm.value;

            const productData = {
                title: formValue.title,
                price: +formValue.price,
                description: formValue.description,
                categoryId: +formValue.categoryId,
                images: formValue.images.filter((img: string) => img.trim())
            };

            const operation = this.isEditMode && this.productId
                ? this.productService.updateProduct(this.productId, productData)
                : this.productService.createProduct(productData);

            operation.subscribe({
                next: () => {
                    const message = this.isEditMode
                        ? 'Producto actualizado correctamente'
                        : 'Producto creado correctamente';
                    this.toastService.success(message);
                    this.router.navigate(['/products']);
                },
                error: (error) => {
                    const message = this.isEditMode
                        ? 'Error al actualizar el producto'
                        : 'Error al crear el producto';
                    this.toastService.error(message);
                    console.error('Error saving product:', error);
                    this.isSubmitting = false;
                },
                complete: () => {
                    this.isSubmitting = false;
                }
            });
        } else {
            Object.keys(this.productForm.controls).forEach(key => {
                const control = this.productForm.get(key);
                control?.markAsTouched();
            });

            this.images.controls.forEach(control => {
                control.markAsTouched();
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/products']);
    }

    getErrorMessage(controlName: string): string {
        const control = this.productForm.get(controlName);
        if (control?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (control?.hasError('minlength')) {
            const minLength = control.getError('minlength').requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }
        if (control?.hasError('min')) {
            return 'El precio debe ser al menos 1';
        }
        return '';
    }
}
