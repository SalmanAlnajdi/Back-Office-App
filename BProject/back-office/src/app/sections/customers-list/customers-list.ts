import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Customer {
  _id: string;
  customerName: string;
  customerNumber: number;
  dateOfBirth: string;
  gender: 'M' | 'F';
}

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers-container">
      @if (customers.length === 0) {
      <div class="no-customers">No customers found</div>
      } @else {
      <div class="customers-grid">
        @for (customer of customers; track customer._id) {
        <div class="customer-card">
          <div class="customer-avatar">
            {{ getInitials(customer.customerName) }}
          </div>
          <div class="customer-info">
            <h3>{{ customer.customerName }}</h3>
            <p>ID: {{ customer.customerNumber }}</p>
            <p>DOB: {{ customer.dateOfBirth | date : 'shortDate' }}</p>
            <p>Gender: {{ customer.gender }}</p>
          </div>
          <div class="customer-actions">
            <button
              (click)="edit.emit(customer)"
              class="btn-icon btn-edit"
              title="Edit customer"
              aria-label="Edit customer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              (click)="remove.emit(customer._id)"
              class="btn-icon btn-remove"
              title="Remove customer"
              aria-label="Remove customer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .customers-container {
        padding: 20px;
      }

      .no-customers {
        text-align: center;
        padding: 40px;
        font-size: 18px;
        color: #3b38a0;
      }

      .customers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .customer-card {
        border: 2px solid #3b38a0;
        border-radius: 8px;
        padding: 20px;
        background: white;
        box-shadow: 0 2px 4px rgba(26, 42, 128, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .customer-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(26, 42, 128, 0.15);
        border-color: #1a2a80;
      }

      .customer-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1a2a80;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .customer-info h3 {
        margin: 0 0 10px 0;
        color: #1a2a80;
      }

      .customer-info p {
        margin: 5px 0;
        color: #3b38a0;
      }

      .customer-actions {
        margin-top: 15px;
        display: flex;
        gap: 10px;
      }

      .btn-edit,
      .btn-remove {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .btn-edit {
        background: #1a2a80;
        color: white;
      }

      .btn-remove {
        background: #dc3545;
        color: white;
      }

      .btn-edit:hover {
        background: #3b38a0;
      }

      .btn-remove:hover {
        background: #c62828;
      }
    `,
  ],
})
export class CustomersList {
  @Input() customers: Customer[] = [];
  @Output() edit = new EventEmitter<Customer>();
  @Output() remove = new EventEmitter<string>();

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
