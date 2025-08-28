import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header>
      <div class="container bar">
        <div class="logo">Customer Management</div>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: #007bff;
        color: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }
      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 56px;
        gap: 12px;
      }
      .logo {
        font-weight: 700;
        font-size: clamp(1rem, 1.2rem + 0.2vw, 1.5rem);
      }

      nav {
        display: flex;
        gap: 16px;
      }
      nav a {
        color: #fff;
        text-decoration: none;
        font-weight: 500;
      }
      nav a:hover {
        text-decoration: underline;
      }

      .menu-btn {
        display: none;
        background: none;
        border: 0;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .bar {
          position: relative;
        }
        nav {
          display: none;
          position: absolute;
          right: clamp(8px, 3vw, 16px);
          top: 56px;
          background: #007bff;
          border-radius: 8px;
          padding: 10px;
          flex-direction: column;
          align-items: flex-start;
          width: min(86vw, 280px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        nav.open {
          display: flex;
        }
        .menu-btn {
          display: block;
        }
      }
    `,
  ],
})
export class Header {
  menuOpen = false;
}
