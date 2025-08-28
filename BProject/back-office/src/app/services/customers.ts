import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Customer {
  _id: string;
  customerName: string;
  customerNumber: number;
  dateOfBirth: string;
  gender: 'M' | 'F';
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private base = `${environment.apiUrl}/customers`;

  private getHeaders(): HttpHeaders {
    const token = this.authService.getCurrentToken();
    if (!token) {
      console.error('No authentication token available');
      throw new Error('No authentication token available. Please login first.');
    }
    
    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      // Token expired or invalid, redirect to login
      this.authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return throwError(() => error);
  }

  // GET all customers
  getAll(): Observable<Customer[]> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<Customer[]>(this.base, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // GET single customer by ID
  getById(id: string): Observable<Customer> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<Customer>(`${this.base}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // POST create new customer
  create(payload: Omit<Customer, '_id'>): Observable<Customer> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.post<Customer>(this.base, payload, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // PUT update customer
  update(id: string, payload: Partial<Omit<Customer, '_id'>>): Observable<Customer> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.put<Customer>(`${this.base}/${id}`, payload, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // DELETE customer
  remove(id: string): Observable<Customer> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.delete<Customer>(`${this.base}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
