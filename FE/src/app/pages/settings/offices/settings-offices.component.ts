import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../../core/services/master-data.service';
import { OfficeMaster, CountryMaster } from '../../../core/models/customer.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-settings-offices',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1 text-dark">Office Master</h3>
          <p class="text-secondary small fw-medium mb-0">Manage registered branch offices, contact details and regional mapping.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="downloadExcel()">
            <i-lucide name="download" style="width: 18px;"></i-lucide>
            <span>Export Excel</span>
          </button>
          <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="openAddModal()">
            <i-lucide name="plus" style="width: 18px;"></i-lucide>
            <span>Add Office</span>
          </button>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="row g-3 mb-4">
        <div class="col-md-12">
          <div class="input-group search-container">
            <span class="input-group-text bg-light border-end-0">
              <i-lucide name="search" style="width: 18px; color: #94a3b8;"></i-lucide>
            </span>
            <input 
              type="text" 
              class="form-control bg-light border-start-0 ps-0 fs-6" 
              placeholder="Search by name, country, or location..." 
              [(ngModel)]="searchQuery"
            >
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase small text-secondary fw-bold">
              <th class="ps-4">Office Details</th>
              <th>Country</th>
              <th>Contact Info</th>
              <th>Address</th>
              <th class="text-end pe-4">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (office of filteredOffices(); track office.id) {
              <tr>
                <td class="ps-4">
                  <div class="d-flex align-items-center fw-bold text-dark">
                    <span class="rounded-circle bg-primary-subtle d-inline-flex justify-content-center align-items-center me-3" style="width: 38px; height: 38px;">
                      <i-lucide name="building-2" style="width: 18px; color: #2563eb;"></i-lucide>
                    </span>
                    {{ office.name }}
                  </div>
                </td>
                <td>
                  <span class="badge bg-light border text-primary fw-bold px-2 py-1">{{ office.country_name }}</span>
                </td>
                <td>
                  <div class="small fw-bold text-dark">{{ office.contact }}</div>
                  <div class="small text-secondary">{{ office.email }}</div>
                </td>
                <td>
                  <div class="text-truncate" style="max-width: 250px;" [title]="office.address">
                    {{ office.address }}
                  </div>
                </td>
                <td class="text-end pe-4">
                  <button (click)="openEditModal(office)" class="btn btn-sm btn-action me-2" title="Edit">
                    <i-lucide name="edit-2" style="width: 16px; color: #2563eb;"></i-lucide>
                  </button>
                  <button (click)="deleteOffice(office.id!)" class="btn btn-sm btn-action text-danger" title="Delete">
                    <i-lucide name="trash-2" style="width: 16px;"></i-lucide>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="text-center py-5 text-secondary">
                   <div class="mb-2"><i-lucide name="inbox" style="width: 48px; opacity: 0.3;"></i-lucide></div>
                   No offices found match your criteria.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    @if (showModal) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold fs-4">{{ isEditing ? 'Update Office Records' : 'New Office Registration' }}</h5>
              <button type="button" class="btn-close shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Office Name</label>
                  <input type="text" class="form-control p-2 px-3 rounded-3" [(ngModel)]="activeOffice.name" placeholder="e.g. Mumbai HQ">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Country Mapping</label>
                  <select class="form-select p-2 px-3 rounded-3" [(ngModel)]="activeOffice.country">
                    <option [value]="0">Select Country...</option>
                    @for (c of countries(); track c.id) {
                      <option [value]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Contact Number</label>
                  <input type="text" class="form-control p-2 px-3 rounded-3" [(ngModel)]="activeOffice.contact" placeholder="+91 22 1234 5678">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Official Email</label>
                  <input type="email" class="form-control p-2 px-3 rounded-3" [(ngModel)]="activeOffice.email" placeholder="office@company.com">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Physical Address</label>
                  <textarea class="form-control p-2 px-3 rounded-3" rows="3" [(ngModel)]="activeOffice.address" placeholder="Unit No, Building Name, Street..."></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
              <button type="button" class="btn btn-light px-4 fw-bold" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" (click)="saveOffice()">
                {{ isEditing ? 'Save Changes' : 'Register Office' }}
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
export class SettingsOfficesComponent implements OnInit {
  private masterDataService = inject(MasterDataService);

  offices = signal<OfficeMaster[]>([]);
  countries = signal<CountryMaster[]>([]);
  searchQuery = signal<string>('');

  showModal = false;
  isEditing = false;
  activeOffice: OfficeMaster = { name: '', country: 0, address: '', contact: '', email: '' };

  filteredOffices = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.offices().filter(o =>
      o.name.toLowerCase().includes(query) ||
      o.country_name?.toLowerCase().includes(query) ||
      o.address.toLowerCase().includes(query) ||
      o.contact.includes(query)
    );
  });

  ngOnInit() {
    this.masterDataService.offices$.subscribe(data => this.offices.set(data));
    this.masterDataService.countries$.subscribe(data => this.countries.set(data));
  }

  openAddModal() {
    this.isEditing = false;
    this.activeOffice = { name: '', country: 0, address: '', contact: '', email: '' };
    this.showModal = true;
  }

  openEditModal(office: OfficeMaster) {
    this.isEditing = true;
    this.activeOffice = { ...office };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveOffice() {
    if (this.activeOffice.country === 0) {
      alert('Please select a country.');
      return;
    }
    if (this.isEditing) {
      this.masterDataService.updateOffice(this.activeOffice).subscribe(() => this.closeModal());
    } else {
      this.masterDataService.addOffice(this.activeOffice).subscribe(() => this.closeModal());
    }
  }

  deleteOffice(id: number) {
    if (confirm('Are you sure you want to delete this office?')) {
      this.masterDataService.deleteOffice(id).subscribe();
    }
  }

  downloadExcel() {
    const dataToExport = this.filteredOffices().map(o => ({
      'Office Name': o.name,
      'Country': o.country_name,
      'Contact': o.contact,
      'Email': o.email,
      'Address': o.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Office Master');
    XLSX.writeFile(workbook, 'KYC_Office_Master.xlsx');
  }
}
