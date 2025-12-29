import { Component, OnInit, inject, signal } from '@angular/core';
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
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private productService = inject(ProductService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);

    productForm: FormGroup;
    categories = signal<Category[]>([]);
    isEditMode = signal<boolean>(false);
    productId = signal<number | undefined>(undefined);
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);

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
                this.isEditMode.set(true);
                this.productId.set(+params['id']);
                this.loadProduct(this.productId()!);
            }
        });
    }

    get images(): FormArray {
        return this.productForm.get('images') as FormArray;
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                this.categories.set(categories);
            },
            error: (error) => {
                this.toastService.error('Error al cargar categorías');
                console.error('Error loading categories:', error);
            }
        });
    }

    loadProduct(id: number): void {
        this.isLoading.set(true);
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    categoryId: product.category.id
                });

                // limpia arreglo de imagenes
                this.images.clear();
                if (product.images && product.images.length > 0) {
                    // verifica si hay imagenes
                    let imageList: string[] = [];
                    if (product.images[0].startsWith('[')) {
                        try {
                            imageList = JSON.parse(product.images[0]);
                        } catch (e) {
                            imageList = product.images;
                        }
                    } else {
                        imageList = product.images;
                    }

                    imageList.forEach(image => {
                        this.images.push(this.fb.control(image, Validators.required));
                    });
                } else {
                    this.images.push(this.fb.control('', Validators.required));
                }

                this.isLoading.set(false);
            },
            error: (error) => {
                this.toastService.error('Error al cargar el producto');
                console.error('Error loading product:', error);
                this.isLoading.set(false);
                this.router.navigate(['/products']);
            }
        });
    }

    addImageField(): void {
        this.images.push(this.fb.control('', Validators.required));
    }

    removeImageField(index: number): void {
        if (this.images.length > 1) {
            this.images.removeAt(index);
        }
    }

    onSubmit(): void {
        if (this.productForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);
            const formValue = this.productForm.value;

            const productData = {
                title: formValue.title,
                price: +formValue.price,
                description: formValue.description,
                categoryId: +formValue.categoryId,
                images: formValue.images.filter((img: string) => img.trim())
            };

            const prodId = this.productId();
            const operation = this.isEditMode() && prodId
                ? this.productService.updateProduct(prodId, productData)
                : this.productService.createProduct(productData);

            operation.subscribe({
                next: () => {
                    const message = this.isEditMode()
                        ? 'Producto actualizado correctamente'
                        : 'Producto creado correctamente';
                    this.toastService.success(message);
                    this.router.navigate(['/products']);
                    this.isSubmitting.set(false);
                },
                error: (error) => {
                    const message = this.isEditMode()
                        ? 'Error al actualizar el producto'
                        : 'Error al crear el producto';
                    this.toastService.error(message);
                    console.error('Error saving product:', error);
                    this.isSubmitting.set(false);
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
