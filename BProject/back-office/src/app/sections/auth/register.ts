import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Admin Registration</h2>

        <!-- Backend Error Message -->
        @if (error()) {
        <div class="error-message">
          <div class="error-icon">❌</div>
          <div class="error-text">{{ error() }}</div>
        </div>
        }

        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              [(ngModel)]="credentials.name"
              required
              placeholder="Enter your full name"
              [disabled]="loading()"
            />
          </div>

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
              minlength="8"
              placeholder="Enter your password"
              [disabled]="loading()"
              (input)="onPasswordInput($event)"
            />

            <!-- Password Criteria Display - Below password field -->
            <div class="password-criteria">
              <h5>Password Requirements:</h5>
              <ul class="criteria-list">
                <li
                  [class.valid]="passwordCriteria().minLength"
                  [class.invalid]="!passwordCriteria().minLength"
                >
                  <span class="criteria-icon">
                    @if (passwordCriteria().minLength) { ✓ } @else { ✗ }
                  </span>
                  At least 8 characters
                </li>
                <li
                  [class.valid]="passwordCriteria().lowercase"
                  [class.invalid]="!passwordCriteria().lowercase"
                >
                  <span class="criteria-icon">
                    @if (passwordCriteria().lowercase) { ✓ } @else { ✗ }
                  </span>
                  One lowercase letter (a-z)
                </li>
                <li
                  [class.valid]="passwordCriteria().uppercase"
                  [class.invalid]="!passwordCriteria().uppercase"
                >
                  <span class="criteria-icon">
                    @if (passwordCriteria().uppercase) { ✓ } @else { ✗ }
                  </span>
                  One uppercase letter (A-Z)
                </li>
                <li
                  [class.valid]="passwordCriteria().number"
                  [class.invalid]="!passwordCriteria().number"
                >
                  <span class="criteria-icon">
                    @if (passwordCriteria().number) { ✓ } @else { ✗ }
                  </span>
                  One number (0-9)
                </li>
                <li
                  [class.valid]="passwordCriteria().special"
                  [class.invalid]="!passwordCriteria().special"
                >
                  <span class="criteria-icon">
                    @if (passwordCriteria().special) { ✓ } @else { ✗ }
                  </span>
                  One special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

          @if (showValidationMessage()) {
          <div class="validation-message">
            <div class="message-icon">⚠️</div>
            <div class="message-text">
              <strong>Please fix the following:</strong>
              <ul>
                @if (!isPasswordValid()) {
                <li>Password does not meet all requirements</li>
                } @if (!credentials.name.trim()) {
                <li>Full name is required</li>
                } @if (!credentials.email.trim()) {
                <li>Email is required</li>
                } @if (!credentials.password) {
                <li>Password is required</li>
                }
              </ul>
            </div>
          </div>
          }

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loading() || !registerForm.form.valid || !isPasswordValid()"
          >
            @if (loading()) { Creating account... } @else { Register }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a (click)="goToLogin()" class="link">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
        max-width: 450px;
        border: 2px solid #3b38a0;
      }

      h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #1a2a80;
        font-size: 28px;
      }

      .error-message {
        background: #ffebee;
        border: 1px solid #f44336;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .error-icon {
        font-size: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .error-text {
        color: #c62828;
        font-size: 14px;
        line-height: 1.4;
        font-weight: 500;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        color: #1a2a80;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 2px solid #3b38a0;
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.3s;
        box-sizing: border-box;
        background: white;
      }

      input:focus {
        outline: none;
        border-color: #1a2a80;
        box-shadow: 0 0 0 3px rgba(26, 42, 128, 0.1);
      }

      input:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
        border-color: #7a85c1;
      }

      .password-criteria {
        margin-top: 12px;
        padding: 12px;
        background: rgba(122, 133, 193, 0.1);
        border-radius: 6px;
        border: 1px solid #7a85c1;
      }

      .password-criteria h5 {
        margin: 0 0 10px 0;
        color: #1a2a80;
        font-size: 14px;
        font-weight: 600;
      }

      .criteria-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .criteria-list li {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        font-size: 12px;
        color: #3b38a0;
        transition: color 0.3s;
      }

      .criteria-list li:last-child {
        margin-bottom: 0;
      }

      .criteria-list li.valid {
        color: #28a745;
      }

      .criteria-list li.invalid {
        color: #dc3545;
      }

      .criteria-icon {
        margin-right: 8px;
        font-weight: bold;
        width: 16px;
        text-align: center;
        font-size: 14px;
      }

      .criteria-list li.valid .criteria-icon {
        color: #28a745;
      }

      .criteria-list li.invalid .criteria-icon {
        color: #dc3545;
      }

      .validation-message {
        background: rgba(122, 133, 193, 0.1);
        border: 1px solid #7a85c1;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .validation-message .message-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .validation-message .message-text {
        color: #1a2a80;
        font-size: 14px;
      }

      .validation-message .message-text strong {
        display: block;
        margin-bottom: 8px;
      }

      .validation-message .message-text ul {
        margin: 0;
        padding-left: 20px;
      }

      .validation-message .message-text li {
        margin-bottom: 4px;
      }

      .btn-primary {
        width: 100%;
        padding: 14px;
        background: #1a2a80;
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
        background: #3b38a0;
      }

      .btn-primary:disabled {
        background: #7a85c1;
        cursor: not-allowed;
      }

      .auth-footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #7a85c1;
      }

      .link {
        color: #1a2a80;
        cursor: pointer;
        text-decoration: underline;
      }

      .link:hover {
        color: #3b38a0;
      }
    `,
  ],
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected credentials = {
    name: '',
    email: '',
    password: '',
  };

  // Password criteria validation
  protected readonly passwordCriteria = signal({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Computed property to check if password meets all criteria
  protected readonly isPasswordValid = computed(() => {
    const criteria = this.passwordCriteria();
    return (
      criteria.minLength &&
      criteria.lowercase &&
      criteria.uppercase &&
      criteria.number &&
      criteria.special
    );
  });

  // Computed property to show validation message
  protected readonly showValidationMessage = computed(() => {
    return this.credentials.password || this.credentials.name || this.credentials.email;
  });

  protected onPasswordInput(event: any) {
    const password = event.target.value;
    this.validatePassword(password);
    // Clear error when user starts typing
    this.error.set(null);
  }

  private validatePassword(password: string) {
    this.passwordCriteria.set({
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }

  protected onRegister() {
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      return;
    }

    // Check if password meets all criteria
    if (!this.isPasswordValid()) {
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(this.credentials.email)) {
      return;
    }

    this.loading.set(true);
    // Clear any previous errors
    this.error.set(null);

    console.log('Sending registration data:', this.credentials);

    this.authService.register(this.credentials).subscribe({
      next: (response) => {
        console.log('Registration response received:', response);
        console.log('Auth state after registration:', {
          isAuthenticated: this.authService.isAuthenticated(),
          hasToken: !!this.authService.getCurrentToken(),
          tokenLength: this.authService.getCurrentToken()?.length,
        });

        // Wait a bit for the auth state to settle, then redirect
        setTimeout(() => {
          if (this.authService.isLoggedIn()) {
            console.log('Redirecting to dashboard...');
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Registration successful but auth state not set properly');
            this.loading.set(false);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Registration error:', err);

        // Extract and display the backend error message
        let errorMessage = 'Registration failed. Please try again.';

        if (err.error?.message) {
          // Use the specific backend error message
          errorMessage = err.error.message;
        } else if (err.status === 500) {
          // Handle server errors
          errorMessage = 'Server error. Please check your input and try again.';
        } else if (err.status === 400) {
          // Handle validation errors
          errorMessage = 'Please check your input and try again.';
        }

        this.error.set(errorMessage);
        this.loading.set(false);
      },
    });
  }

  protected goToLogin() {
    this.router.navigate(['/login']);
  }
}
