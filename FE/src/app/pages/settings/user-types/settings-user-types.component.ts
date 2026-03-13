import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../../core/services/master-data.service';
import { UserTypeMaster } from '../../../core/models/customer.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-settings-user-types',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
           <h3 class="fw-bold mb-1 text-dark">User Classifications</h3>
           <p class="text-secondary small fw-medium mb-0">Define organizational entity types and identification requirements.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="downloadExcel()">
            <i-lucide name="download" style="width: 18px;"></i-lucide>
            <span>Export Excel</span>
          </button>
          <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="openAddModal()">
            <i-lucide name="plus" style="width: 18px;"></i-lucide>
            <span>Add Classification</span>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="row g-3 mb-4">
        <div class="col-md-12">
          <div class="input-group search-container">
            <span class="input-group-text bg-light border-end-0">
              <i-lucide name="search" style="width: 18px; color: #94a3b8;"></i-lucide>
            </span>
            <input 
              type="text" 
              class="form-control bg-light border-start-0 ps-0 fs-6" 
              placeholder="Search by name or description..." 
              [(ngModel)]="searchQuery"
            >
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase small text-secondary fw-bold border-bottom">
              <th class="ps-4 py-3">Classification Name</th>
              <th class="py-3">System Description</th>
              <th class="text-end pe-4 py-3">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (type of filteredUserTypes(); track type.id) {
              <tr class="border-bottom">
                <td class="ps-4">
                  <div class="d-flex align-items-center fw-bold text-dark py-2">
                    <span class="rounded-circle bg-primary-subtle d-inline-flex justify-content-center align-items-center me-3" style="width: 38px; height: 38px;">
                      <i-lucide name="users" style="width: 18px; color: #2563eb;"></i-lucide>
                    </span>
                    {{ type.name }}
                  </div>
                </td>
                <td style="max-width: 400px;">
                  <span class="text-secondary small fw-medium">{{ type.description }}</span>
                </td>
                <td class="text-end pe-4">
                  <button (click)="openEditModal(type)" class="btn btn-sm btn-action me-2" title="Edit">
                    <i-lucide name="edit-2" style="width: 16px; color: #2563eb;"></i-lucide>
                  </button>
                  <button (click)="deleteUserType(type.id!)" class="btn btn-sm btn-action text-danger" title="Delete">
                    <i-lucide name="trash-2" style="width: 16px;"></i-lucide>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="3" class="text-center py-5 text-secondary">
                   <div class="mb-2"><i-lucide name="inbox" style="width: 48px; opacity: 0.3;"></i-lucide></div>
                   No classifications found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Management Modal -->
    @if (showModal) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold fs-4">{{ isEditing ? 'Edit Classification' : 'New Classification' }}</h5>
              <button type="button" class="btn-close shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Type Name</label>
                  <input type="text" class="form-control p-2 px-3 rounded-3" [(ngModel)]="activeType.name" placeholder="e.g. Corporate Entity">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Description</label>
                  <textarea class="form-control p-2 px-3 rounded-3" rows="4" [(ngModel)]="activeType.description" placeholder="Briefly explain the scope of this classification..."></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
              <button type="button" class="btn btn-light px-4 fw-bold" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" (click)="saveUserType()">
                {{ isEditing ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <style>
      .search-container input:focus {
        background-color: white !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
        border-color: #2563eb !important;
      }
      .btn-action {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }
      .modal-backdrop {
        background-color: rgba(15, 23, 42, 0.8);
      }
    </style>
  `
})
export class SettingsUserTypesComponent implements OnInit {
  private masterDataService = inject(MasterDataService);

  userTypes = signal<UserTypeMaster[]>([]);
  searchQuery = signal<string>('');

  showModal = false;
  isEditing = false;
  activeType: UserTypeMaster = { name: '', description: '' };

  filteredUserTypes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.userTypes().filter(t =>
      t.name.toLowerCase().includes(query) ||
      (t.description?.toLowerCase().includes(query))
    );
  });

  ngOnInit() {
    this.masterDataService.userTypes$.subscribe(data => this.userTypes.set(data));
  }

  openAddModal() {
    this.isEditing = false;
    this.activeType = { name: '', description: '' };
    this.showModal = true;
  }

  openEditModal(type: UserTypeMaster) {
    this.isEditing = true;
    this.activeType = { ...type };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUserType() {
    if (!this.activeType.name) {
      alert('Classification Name is required.');
      return;
    }
    if (this.isEditing) {
      this.masterDataService.updateUserType(this.activeType).subscribe(() => this.closeModal());
    } else {
      this.masterDataService.addUserType(this.activeType).subscribe(() => this.closeModal());
    }
  }

  deleteUserType(id: number) {
    if (confirm('Delete this classification? This might affect existing entity records.')) {
      this.masterDataService.deleteUserType(id).subscribe();
    }
  }

  downloadExcel() {
    const dataToExport = this.filteredUserTypes().map(t => ({
      'Classification Name': t.name,
      'Description': t.description
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Classifications');
    XLSX.writeFile(workbook, 'KYC_User_Classifications.xlsx');
  }
}
