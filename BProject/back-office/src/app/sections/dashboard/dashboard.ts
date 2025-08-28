import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Hero],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Customer Management System</h1>
          <div class="user-info">
            <span>Welcome, {{ currentAdmin()?.name }}</span>
            <button (click)="logout()" class="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        @if (isAuthenticated()) {
        <app-hero></app-hero>
        } @else {
        <div class="loading">Checking authentication...</div>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background: white;
      }

      .dashboard-header {
        background: #1a2a80;
        box-shadow: 0 2px 4px rgba(26, 42, 128, 0.1);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 2px solid #3b38a0;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        margin: 0;
        color: #ffffffff;
        font-size: 24px;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-info span {
        color: #ffffffff;
      }

      .btn-logout {
        padding: 8px 16px;
        background: #1a2a80;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(26, 42, 128, 0.2);
        border: 2px solid #ffffffff;
      }

      .btn-logout:hover {
        background: #3b38a0;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(26, 42, 128, 0.3);
      }

      .btn-logout:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(26, 42, 128, 0.2);
      }

      .dashboard-main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .loading {
        text-align: center;
        padding: 40px;
        font-size: 18px;
        color: #3b38a0;
      }
    `,
  ],
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly currentAdmin = this.authService.currentAdmin;
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  ngOnInit() {
    console.log('Dashboard initialized, checking auth...');
    console.log('Is authenticated:', this.authService.isLoggedIn());

    // Check authentication on component init
    if (!this.authService.isLoggedIn()) {
      console.log('User not authenticated, redirecting to login...');
      this.router.navigate(['/login']);
    } else {
      console.log('User authenticated, showing dashboard...');
    }
  }

  protected logout() {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
