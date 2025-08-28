import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Admin Login</h2>

        @if (error()) {
        <div class="error-message">{{ error() }}</div>
        }

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="credentials.email"
              required
              email
              placeholder="Enter your email"
              [disabled]="loading()"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              placeholder="Enter your password"
              [disabled]="loading()"
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading() || !loginForm.form.valid">
            @if (loading()) { Logging in... } @else { Login }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a (click)="goToRegister()" class="link">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      padding: 20px;
    }
    
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(26, 42, 128, 0.15);
      width: 100%;
      max-width: 400px;
      border: 2px solid #3B38A0;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #1A2A80;
      font-size: 28px;
    }
    
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
      border: 1px solid #ffcdd2;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #1A2A80;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #3B38A0;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
      background: white;
    }
    
    input:focus {
      outline: none;
      border-color: #1A2A80;
      box-shadow: 0 0 0 3px rgba(26, 42, 128, 0.1);
    }
    
    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      border-color: #7A85C1;
    }
    
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: #1A2A80;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
      margin-top: 10px;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #3B38A0;
    }
    
    .btn-primary:disabled {
      background: #7A85C1;
      cursor: not-allowed;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #7A85C1;
    }
    
    .link {
      color: #1A2A80;
      cursor: pointer;
      text-decoration: underline;
    }
    
    .link:hover {
      color: #3B38A0;
    }
  `]
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  
  protected credentials = {
    email: '',
    password: ''
  };

  protected onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login response received:', response);
        console.log('Auth state after login:', {
          isAuthenticated: this.authService.isAuthenticated(),
          hasToken: !!this.authService.getCurrentToken(),
          tokenLength: this.authService.getCurrentToken()?.length
        });
        
        // Wait a bit for the auth state to settle, then redirect
        setTimeout(() => {
          if (this.authService.isLoggedIn()) {
            console.log('Redirecting to dashboard...');
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Login successful but auth state not set properly');
            this.error.set('Login successful but authentication failed. Please try again.');
            this.loading.set(false);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected goToRegister() {
    this.router.navigate(['/register']);
  }
}
