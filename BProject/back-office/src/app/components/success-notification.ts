import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show()) {
    <div class="success-notification">
      <span class="message">{{ message() }}</span>
      <button (click)="hide()" class="close-btn">&times;</button>
    </div>
    }
  `,
  styles: [
    `
      .success-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease-out;
      }

      .message {
        font-weight: 500;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class SuccessNotification {
  protected readonly show = signal(false);
  protected readonly message = signal('');

  showMessage(msg: string) {
    this.message.set(msg);
    this.show.set(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  protected hide() {
    this.show.set(false);
  }
}
