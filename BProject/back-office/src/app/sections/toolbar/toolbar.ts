import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <button class="btn-add" (click)="add.emit()">
        <span class="icon">+</span> Add Customer
      </button>
      <div class="search-container">
        <input
          class="search-input"
          [(ngModel)]="query"
          (input)="filterChange.emit(query)"
          placeholder="Filter by name or phone..."
          aria-label="Filter customers"
        />
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid #3B38A0;
      box-shadow: 0 2px 4px rgba(26, 42, 128, 0.1);
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn-add {
      background: #1A2A80;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(26, 42, 128, 0.2);
    }

    .btn-add:hover {
      background: #3B38A0;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(26, 42, 128, 0.3);
    }

    .btn-add:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(26, 42, 128, 0.2);
    }

    .btn-add .icon {
      font-size: 16px;
      font-weight: bold;
    }

    .search-container {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 10px 16px;
      border: 2px solid #3B38A0;
      border-radius: 25px;
      font-size: 14px;
      background: white;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #1A2A80;
      box-shadow: 0 0 0 3px rgba(26, 42, 128, 0.1);
    }

    .search-input::placeholder {
      color: #7A85C1;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        min-width: auto;
      }
      
      .btn-add {
        justify-content: center;
      }
    }
  `]
})
export class Toolbar {
  @Output() add = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<string>();
  query = '';
}
