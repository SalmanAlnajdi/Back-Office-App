import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;      // Changed from 'name' to match backend
  email: string;     // Added email field
  password: string;  // Keep password field
}

// Updated to match your backend response format
export interface AuthResponse {
  user: {
    id: string;      // Changed from _id to id to match backend
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private base = `${environment.apiUrl}/auth`;

  // State signals
  private readonly _isAuthenticated = signal(false);
  private readonly _currentAdmin = signal<any>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _isLoading = signal(false);

  // Public computed signals
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentAdmin = this._currentAdmin.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    // Only check for stored token in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.checkStoredToken();
    }
  }

  private checkStoredToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const admin = localStorage.getItem('admin_data');
      
      console.log('Checking stored token:', { token: token ? 'exists' : 'missing', admin: admin ? 'exists' : 'missing' });
      
      if (token && admin) {
        // Validate token format (basic check)
        if (token.length > 10) { // Basic validation that token exists and has reasonable length
          this._token.set(token);
          this._currentAdmin.set(JSON.parse(admin));
          this._isAuthenticated.set(true);
          console.log('Token restored successfully:', { tokenLength: token.length, admin: JSON.parse(admin) });
        } else {
          console.log('Invalid token format, clearing auth');
          this.clearAuth();
        }
      } else {
        console.log('No stored token or admin data found');
        this.clearAuth();
      }
    } catch (error) {
      console.error('Error restoring token:', error);
      this.clearAuth();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    
    return this.http.post<AuthResponse>(`${this.base}/login`, credentials).pipe(
      tap(response => {
        console.log('Login successful:', response);
        
        // Extract data from your backend response format
        const token = response.accessToken;
        const admin = response.user;
        
        console.log('Extracted token:', token ? `length: ${token.length}` : 'null');
        console.log('Extracted admin:', admin);
        
        // Set all auth state at once to ensure consistency
        this._token.set(token);
        this._currentAdmin.set(admin);
        this._isAuthenticated.set(true);
        this._isLoading.set(false);
        
        // Store in localStorage only in browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_data', JSON.stringify(admin));
          console.log('Auth data stored in localStorage');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        this._isLoading.set(false);
        this.clearAuth(); // Clear any partial state
        return throwError(() => error);
      })
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    
    console.log('Sending registration request with:', credentials);
    
    return this.http.post<AuthResponse>(`${this.base}/register`, credentials).pipe(
      tap(response => {
        console.log('Registration successful:', response);
        
        // Extract data from your backend response format
        const token = response.accessToken;
        const admin = response.user;
        
        // Set all auth state at once to ensure consistency
        this._token.set(token);
        this._currentAdmin.set(admin);
        this._isAuthenticated.set(true);
        this._isLoading.set(false);
        
        // Store in localStorage only in browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_data', JSON.stringify(admin));
          console.log('Auth data stored in localStorage');
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        this._isLoading.set(false);
        this.clearAuth(); // Clear any partial state
        return throwError(() => error);
      })
    );
  }

  logout() {
    console.log('Logging out...');
    this.clearAuth();
  }

  private clearAuth() {
    console.log('Clearing authentication state');
    this._token.set(null);
    this._currentAdmin.set(null);
    this._isAuthenticated.set(false);
    this._isLoading.set(false);
    
    // Clear localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      console.log('localStorage cleared');
    }
  }

  getAuthHeaders() {
    const token = this._token();
    if (!token) {
      console.error('No token available for API call');
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  }

  // Method to check if user is logged in
  isLoggedIn(): boolean {
    const isAuth = this._isAuthenticated();
    const hasToken = !!this._token();
    const token = this._token();
    
    console.log('Auth check - isAuth:', isAuth, 'hasToken:', hasToken, 'tokenLength:', token?.length);
    
    // Ensure both conditions are met
    const isLoggedIn = isAuth && hasToken;
    
    // If state is inconsistent, fix it
    if (isAuth !== hasToken) {
      console.warn('Inconsistent auth state detected, fixing...');
      if (!hasToken) {
        this._isAuthenticated.set(false);
      }
    }
    
    return isLoggedIn;
  }

  // Method to get current token
  getCurrentToken(): string | null {
    const token = this._token();
    console.log('Getting current token:', token ? `length: ${token.length}` : 'null');
    return token;
  }

  // Method to refresh token (if needed)
  refreshToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Refreshing token from localStorage...');
      this.checkStoredToken();
    }
  }

  // Method to force re-check authentication
  recheckAuth(): void {
    console.log('Force rechecking authentication...');
    this.checkStoredToken();
  }
}
