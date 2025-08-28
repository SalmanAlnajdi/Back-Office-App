import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersList } from '../customers-list/customers-list';
import { Toolbar } from '../toolbar/toolbar';
import { CustomersService, Customer } from '../../services/customers';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomersList, Toolbar],
  template: `
    <section id="hero" class="hero">
      <!-- Toolbar on top on ALL screen sizes -->
      <div class="pane pane-controls">
        <app-toolbar (add)="openAdd()" (filterChange)="onFilter($event)"></app-toolbar>
      </div>

      <!-- List below -->
      <div class="pane pane-list">
        @if (loading()) {
        <div class="loading">Loading customers...</div>
        } @else if (error()) {
        <div class="error">
          <p>Error: {{ error() }}</p>
          <button (click)="loadCustomers()" class="btn-retry">Retry</button>
        </div>
        } @else {
        <app-customers-list
          [customers]="filtered()"
          (edit)="edit($event)"
          (remove)="remove($event)"
        ></app-customers-list>
        }
      </div>

      <!-- Modal for add/edit -->
      @if (showAdd()) {
      <div class="modal-backdrop" (click)="closeAdd()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ draft()._id ? 'Edit' : 'Add' }} Customer</h3>

          @if (saveError()) {
          <div class="error-message">{{ saveError() }}</div>
          }

          <form (ngSubmit)="save()" #customerForm="ngForm">
            <div class="form-group">
              <label for="name">Name:</label>
              <input
                id="name"
                type="text"
                [(ngModel)]="draft().customerName"
                name="name"
                required
                placeholder="Enter customer name"
                [disabled]="saving()"
              />
            </div>

            <div class="form-group">
              <label for="number">ID Number:</label>
              <input
                id="number"
                type="number"
                [(ngModel)]="draft().customerNumber"
                name="number"
                required
                placeholder="Enter ID number"
                [disabled]="saving()"
              />
            </div>

            <div class="form-group">
              <label for="dob">Date of Birth:</label>
              <input
                id="dob"
                type="date"
                [(ngModel)]="draft().dateOfBirth"
                name="dob"
                required
                [disabled]="saving()"
              />
            </div>

            <div class="form-group">
              <label for="gender">Gender:</label>
              <select
                id="gender"
                [(ngModel)]="draft().gender"
                name="gender"
                required
                [disabled]="saving()"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div class="form-actions">
              <button
                type="button"
                (click)="closeAdd()"
                class="btn-secondary"
                [disabled]="saving()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="saving() || !customerForm.form.valid"
              >
                @if (saving()) {
                {{ draft()._id ? 'Updating...' : 'Creating...' }}
                } @else {
                {{ draft()._id ? 'Update' : 'Create' }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
      }
    </section>
  `,
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        width: 100%;
      }

      .pane {
        width: 100%;
      }

      .loading,
      .error {
        text-align: center;
        padding: 40px;
        font-size: 18px;
      }

      .error {
        color: #dc3545;
      }

      .btn-retry {
        padding: 8px 16px;
        background: #1a2a80;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .btn-retry:hover {
        background: #3b38a0;
      }

      @media (min-width: 992px) {
        .pane-controls {
          position: sticky;
          top: 72px;
          z-index: 2;
          background: transparent;
        }
      }

      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 42, 128, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background: white;
        padding: 24px;
        border-radius: 8px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(26, 42, 128, 0.15);
        border: 2px solid #3b38a0;
      }

      .modal h3 {
        margin: 0 0 20px 0;
        color: #1a2a80;
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
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #1a2a80;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 10px;
        border: 2px solid #3b38a0;
        border-radius: 4px;
        font-size: 14px;
        background: white;
        box-sizing: border-box;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #1a2a80;
        box-shadow: 0 0 0 3px rgba(26, 42, 128, 0.1);
      }

      .form-group input:disabled,
      .form-group select:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
        border-color: #7a85c1;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
      }

      .btn-primary,
      .btn-secondary {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }

      .btn-primary {
        background: #1a2a80;
        color: white;
      }

      .btn-secondary {
        background: white;
        color: #1a2a80;
        border: 2px solid #3b38a0;
      }

      .btn-primary:hover:not(:disabled) {
        background: #3b38a0;
      }

      .btn-secondary:hover:not(:disabled) {
        background: rgba(122, 133, 193, 0.1);
      }

      .btn-primary:disabled,
      .btn-secondary:disabled {
        background: #7a85c1;
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ],
})
export class Hero implements OnInit {
  private customersService = inject(CustomersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State signals
  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showAdd = signal(false);
  protected readonly draft = signal<Partial<Customer>>({});
  protected readonly filterText = signal('');
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  // Computed filtered customers
  protected readonly filtered = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    const customers = this.customers();

    if (!text) return customers;

    return customers.filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(text) ||
        customer.customerNumber.toString().includes(text)
    );
  });

  ngOnInit() {
    // Check if user is authenticated before loading customers
    console.log('Hero component initialized, checking auth...');
    console.log('Is authenticated:', this.authService.isLoggedIn());
    console.log('Current token:', this.authService.getCurrentToken());

    if (!this.authService.isLoggedIn()) {
      console.log('User not authenticated, redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log('User authenticated, loading customers...');
    this.loadCustomers();
  }

  protected loadCustomers() {
    if (!this.authService.isLoggedIn()) {
      console.log('Cannot load customers - user not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.customersService.getAll().subscribe({
      next: (customers) => {
        console.log('Customers loaded successfully:', customers);
        this.customers.set(customers);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error.set(this.getErrorMessage(err));
        this.loading.set(false);

        // If it's an auth error, redirect to login
        if (err.message?.includes('authentication') || err.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  protected onFilter(query: string) {
    this.filterText.set(query);
  }

  protected openAdd() {
    this.draft.set({
      customerName: '',
      customerNumber: undefined,
      dateOfBirth: '',
      gender: 'M',
    });
    this.saveError.set(null);
    this.showAdd.set(true);
  }

  protected closeAdd() {
    this.showAdd.set(false);
    this.draft.set({});
    this.saveError.set(null);
    this.saving.set(false);
  }

  protected save() {
    if (!this.authService.isLoggedIn()) {
      console.log('Cannot save customer - user not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    const draft = this.draft();

    if (!draft.customerName || !draft.customerNumber || !draft.dateOfBirth || !draft.gender) {
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    if (draft._id) {
      // Update existing customer
      this.customersService.update(draft._id, draft).subscribe({
        next: (updatedCustomer) => {
          console.log('Customer updated successfully:', updatedCustomer);
          this.customers.update((customers) =>
            customers.map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c))
          );
          this.closeAdd();
          this.showSuccessMessage('Customer updated successfully!');
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          this.saveError.set(this.getErrorMessage(err));
          this.saving.set(false);

          // If it's an auth error, redirect to login
          if (err.message?.includes('authentication') || err.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      // Create new customer
      this.customersService.create(draft as Omit<Customer, '_id'>).subscribe({
        next: (newCustomer) => {
          console.log('Customer created successfully:', newCustomer);
          this.customers.update((customers) => [newCustomer, ...customers]);
          this.closeAdd();
          this.showSuccessMessage('Customer created successfully!');
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          this.saveError.set(this.getErrorMessage(err));
          this.saving.set(false);

          // If it's an auth error, redirect to login
          if (err.message?.includes('authentication') || err.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });
    }
  }

  protected edit(customer: Customer) {
    this.draft.set({ ...customer });
    this.saveError.set(null);
    this.showAdd.set(true);
  }

  protected remove(id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    this.customersService.remove(id).subscribe({
      next: () => {
        this.customers.update((customers) => customers.filter((c) => c._id !== id));
        this.showSuccessMessage('Customer deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
        this.error.set(this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.status === 401) {
      return 'Unauthorized. Please login again.';
    }
    if (error.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'Resource not found.';
    }
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  private showSuccessMessage(message: string) {
    // Simple success feedback - you could enhance this with a toast notification
    console.log(message);
  }
}
