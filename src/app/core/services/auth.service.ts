import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
  isGuest?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://api.escuelajs.co/api/v1';
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const guestData = localStorage.getItem('is_guest');
    if (guestData === 'true') {
      this.currentUserSubject.next(this.getGuestUser());
    } else {
      const token = this.getToken();
      if (token) {
        this.loadUserProfile();
      }
    }
  }

  private getGuestUser(): User {
    return {
      id: 0,
      email: 'guest@platzi.com',
      name: 'Invitado',
      role: 'customer',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      isGuest: true
    };
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.removeItem('is_guest');
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          this.loadUserProfile();
        })
      );
  }

  loginAsGuest(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('is_guest', 'true');
    this.currentUserSubject.next(this.getGuestUser());
    this.router.navigate(['/products']);
  }

  loadUserProfile(): void {
    this.http.get<User>(`${this.API_URL}/auth/profile`)
      .subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_guest');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isGuest(): boolean {
    return !!this.currentUserSubject.value?.isGuest;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() || this.isGuest();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
