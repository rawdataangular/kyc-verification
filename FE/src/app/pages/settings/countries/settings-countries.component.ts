import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../../core/services/master-data.service';
import { CountryMaster } from '../../../core/models/customer.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-settings-countries',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1 text-dark">Country Master</h3>
          <p class="text-secondary small fw-medium mb-0">Manage global regions, dialing codes, and ISO abbreviations.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="downloadExcel()">
            <i-lucide name="download" style="width: 18px;"></i-lucide>
            <span>Export Excel</span>
          </button>
          <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="openAddModal()">
            <i-lucide name="plus" style="width: 18px;"></i-lucide>
            <span>Add Country</span>
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
              placeholder="Search by name, code or dial code..." 
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
              <th class="ps-4">Country Name</th>
              <th>Alpha-2</th>
              <th>Alpha-3</th>
              <th>Dialing Code</th>
              <th class="text-end pe-4">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (country of filteredCountries(); track country.id) {
              <tr>
                <td class="ps-4">
                  <div class="d-flex align-items-center fw-bold text-dark">
                    <span class="rounded-circle bg-primary-subtle d-inline-flex justify-content-center align-items-center me-3" style="width: 38px; height: 38px;">
                      <i-lucide name="globe" style="width: 18px; color: #2563eb;"></i-lucide>
                    </span>
                    {{ country.name }}
                  </div>
                </td>
                <td><code class="px-2 py-1 bg-light rounded text-secondary">{{ country.code_2 || '--' }}</code></td>
                <td><code class="px-2 py-1 bg-light rounded text-primary">{{ country.code_3 || '---' }}</code></td>
                <td><span class="fw-bold text-dark badge bg-light border text-dark">+{{ country.dial_code }}</span></td>
                <td class="text-end pe-4">
                  <button (click)="openEditModal(country)" class="btn btn-sm btn-action me-2" title="Edit">
                    <i-lucide name="edit-2" style="width: 16px; color: #2563eb;"></i-lucide>
                  </button>
                  <button (click)="deleteCountry(country.id!)" class="btn btn-sm btn-action text-danger" title="Delete">
                    <i-lucide name="trash-2" style="width: 16px;"></i-lucide>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="text-center py-5 text-secondary">
                   <div class="mb-2"><i-lucide name="inbox" style="width: 48px; opacity: 0.3;"></i-lucide></div>
                   No matching countries found in master list.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal (Simple CSS Overlay) -->
    @if (showModal) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold fs-4">{{ isEditing ? 'Update Country' : 'New Country Registration' }}</h5>
              <button type="button" class="btn-close shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Country Name</label>
                  <input type="text" class="form-control p-2 px-3 fs-6 rounded-3" [(ngModel)]="activeCountry.name" placeholder="e.g. Germany">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Alpha-2 Code</label>
                  <input type="text" class="form-control p-2 px-3 fs-6 rounded-3" [(ngModel)]="activeCountry.code_2" placeholder="DE">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Alpha-3 Code</label>
                  <input type="text" class="form-control p-2 px-3 fs-6 rounded-3" [(ngModel)]="activeCountry.code_3" placeholder="DEU">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Dialing Code</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">+</span>
                    <input type="text" class="form-control p-2 px-3 fs-6 rounded-3 border-start-0" [(ngModel)]="activeCountry.dial_code" placeholder="49">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
              <button type="button" class="btn btn-light px-4 fw-bold" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary px-4 fw-bold" (click)="saveCountry()">
                {{ isEditing ? 'Update Records' : 'Register Country' }}
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
        transition: all 0.2s;
      }
      .btn-action:hover {
        background: #f1f5f9;
        transform: translateY(-2px);
      }
      .modal-backdrop {
        background-color: rgba(15, 23, 42, 0.8);
      }
    </style>
  `
})
export class SettingsCountriesComponent implements OnInit {
  private masterDataService = inject(MasterDataService);

  countries = signal<CountryMaster[]>([]);
  searchQuery = signal<string>('');

  showModal = false;
  isEditing = false;
  activeCountry: CountryMaster = { name: '', code_2: '', code_3: '', dial_code: '' };

  filteredCountries = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.countries().filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.code_2?.toLowerCase().includes(query)) ||
      (c.code_3?.toLowerCase().includes(query)) ||
      c.dial_code.includes(query)
    );
  });

  ngOnInit() {
    this.masterDataService.countries$.subscribe(data => {
      this.countries.set(data);
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.activeCountry = { name: '', code_2: '', code_3: '', dial_code: '' };
    this.showModal = true;
  }

  openEditModal(country: CountryMaster) {
    this.isEditing = true;
    this.activeCountry = { ...country };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCountry() {
    if (!this.activeCountry.name || !this.activeCountry.dial_code) {
      alert('Name and Dial Code are required.');
      return;
    }

    if (this.isEditing) {
      this.masterDataService.updateCountry(this.activeCountry).subscribe(() => this.closeModal());
    } else {
      this.masterDataService.addCountry(this.activeCountry).subscribe(() => this.closeModal());
    }
  }

  deleteCountry(id: number) {
    if (confirm('Permanently remove this country from the master database?')) {
      this.masterDataService.deleteCountry(id).subscribe();
    }
  }

  downloadExcel() {
    const dataToExport = this.filteredCountries().map(c => ({
      'Country Name': c.name,
      'Alpha-2': c.code_2 || 'N/A',
      'Alpha-3': c.code_3 || 'N/A',
      'Dialing Code': `+${c.dial_code}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Country Master');
    XLSX.writeFile(workbook, 'KYC_Country_Master.xlsx');
  }
}
