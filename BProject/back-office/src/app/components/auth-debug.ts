import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-debug" *ngIf="showDebug">
      <h4>Auth Debug Info</h4>
      <div class="debug-item"><strong>Is Authenticated:</strong> {{ isAuthenticated() }}</div>
      <div class="debug-item"><strong>Has Token:</strong> {{ hasToken() }}</div>
      <div class="debug-item"><strong>Token Length:</strong> {{ tokenLength() }}</div>
      <div class="debug-item">
        <strong>Current Admin:</strong> {{ currentAdmin()?.name || 'None' }}
      </div>
      <div class="debug-item">
        <strong>localStorage Token:</strong> {{ localStorageToken() ? 'Exists' : 'Missing' }}
      </div>
      <div class="debug-item">
        <strong>localStorage Admin:</strong> {{ localStorageAdmin() ? 'Exists' : 'Missing' }}
      </div>
      <button (click)="refreshAuth()" class="btn-refresh">Refresh Auth</button>
      <button (click)="clearAuth()" class="btn-clear">Clear Auth</button>
    </div>
  `,
  styles: [
    `
      .auth-debug {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        font-size: 12px;
        max-width: 300px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .auth-debug h4 {
        margin: 0 0 12px 0;
        color: #333;
      }

      .debug-item {
        margin-bottom: 8px;
        padding: 4px 0;
        border-bottom: 1px solid #eee;
      }

      .btn-refresh,
      .btn-clear {
        margin: 4px;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }

      .btn-refresh {
        background: #2196f3;
        color: white;
      }

      .btn-clear {
        background: #f44336;
        color: white;
      }
    `,
  ],
})
export class AuthDebug {
  private authService = inject(AuthService);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly currentAdmin = this.authService.currentAdmin;
  protected readonly token = this.authService.token;

  protected readonly showDebug = true; // Set to false in production

  protected hasToken(): boolean {
    return !!this.token();
  }

  protected tokenLength(): number {
    return this.token()?.length || 0;
  }

  protected localStorageToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  }

  protected localStorageAdmin(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('admin_data') : null;
  }

  protected refreshAuth() {
    this.authService.recheckAuth();
  }

  protected clearAuth() {
    this.authService.logout();
  }
}
