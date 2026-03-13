import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MasterDataService } from '../../../core/services/master-data.service';
import { DocumentRequirement, CountryMaster, OfficeMaster, UserTypeMaster, DocumentTypeMaster } from '../../../core/models/customer.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-settings-mapping-matrix',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1 text-dark">Document Mapping Matrix</h3>
          <p class="text-secondary small fw-medium mb-0">Map UserType, Country, and Office to specific Document Requirements.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="downloadExcel()">
            <i-lucide name="download" style="width: 18px;"></i-lucide>
            <span>Export Matrix</span>
          </button>
          <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm" (click)="openAddModal()">
            <i-lucide name="plus" style="width: 18px;"></i-lucide>
            <span>Create Mapping</span>
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
              class="form-control bg-light border-start-0 ps-0 fs-6 shadow-none" 
              placeholder="Search by country, office, user type or document..." 
              [(ngModel)]="searchQuery"
            >
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase small text-secondary fw-bold border-bottom">
              <th class="ps-4 py-3">Profile Context (User / Location)</th>
              <th class="py-3">Document Requirement</th>
              <th class="py-3">Priority</th>
              <th class="text-end pe-4 py-3">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (item of filteredMatrix(); track item.id) {
              <tr class="border-bottom">
                <td class="ps-4">
                  <div class="d-flex flex-column gap-1 py-1">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold me-2 small">{{ item.user_type_name }}</span>
                        <span class="text-dark fw-bold">{{ item.country_name }}</span>
                    </div>
                    <div class="small text-secondary fw-medium">
                        <i-lucide name="map-pin" style="width: 12px; margin-right: 4px;"></i-lucide> 
                        {{ item.office_name }} Branch
                    </div>
                  </div>
                </td>
                <td>
                   <div class="d-flex align-items-center fw-bold text-dark">
                      <span class="rounded-circle bg-light d-inline-flex justify-content-center align-items-center me-2" style="width: 32px; height: 32px;">
                        <i-lucide name="file-text" style="width: 14px; color: #64748b;"></i-lucide>
                      </span>
                      {{ item.document_type_name }}
                   </div>
                </td>
                <td>
                   @if (item.is_mandatory) {
                       <span class="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 fw-bold small text-uppercase">Mandatory</span>
                   } @else {
                       <span class="badge rounded-pill bg-light text-secondary border border-secondary-subtle px-3 py-1 fw-bold small text-uppercase">Optional</span>
                   }
                </td>
                <td class="text-end pe-4">
                  <button (click)="openEditModal(item)" class="btn btn-sm btn-action me-2" title="Edit">
                    <i-lucide name="edit-2" style="width: 16px; color: #2563eb;"></i-lucide>
                  </button>
                  <button (click)="deleteMapping(item.id!)" class="btn btn-sm btn-action text-danger" title="Delete">
                    <i-lucide name="trash-2" style="width: 16px;"></i-lucide>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="text-center py-5 text-secondary">
                   <div class="mb-2"><i-lucide name="inbox" style="width: 48px; opacity: 0.3;"></i-lucide></div>
                   No mappings found in the matrix.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mapping Management Modal -->
    @if (showModal) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold fs-4">{{ isEditing ? 'Edit Matrix Entry' : 'Configure New Mapping' }}</h5>
              <button type="button" class="btn-close shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">User Classification</label>
                  <select class="form-select p-2 px-3 rounded-3 shadow-none" [(ngModel)]="activeMapping.user_type">
                    <option [value]="0">Select Type...</option>
                    @for (t of userTypes(); track t.id) {
                      <option [value]="t.id">{{ t.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Target Country</label>
                  <select class="form-select p-2 px-3 rounded-3 shadow-none" [(ngModel)]="activeMapping.country">
                    <option [value]="0">Select Country...</option>
                    @for (c of countries(); track c.id) {
                      <option [value]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Assigned Office</label>
                  <select class="form-select p-2 px-3 rounded-3 shadow-none" [(ngModel)]="activeMapping.office">
                    <option [value]="0">Select Office...</option>
                    @for (o of offices(); track o.id) {
                      <option [value]="o.id">{{ o.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Document to Map</label>
                  <select class="form-select p-2 px-3 rounded-3 shadow-none" [(ngModel)]="activeMapping.document_type">
                    <option [value]="0">Select Document...</option>
                    @for (d of docTypes(); track d.id) {
                      <option [value]="d.id">{{ d.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-12 mt-4 pt-2 border-top">
                  <div class="form-check form-switch d-flex align-items-center gap-2 p-0">
                    <input class="form-check-input ms-0 me-2 shadow-none" type="checkbox" role="switch" id="mandatorySwitch" [(ngModel)]="activeMapping.is_mandatory" style="width: 45px; height: 22px;">
                    <label class="form-check-label fw-bold text-dark mb-0 ms-1 cursor-pointer" for="mandatorySwitch">
                       Enable Mandatory Status for this Document
                    </label>
                  </div>
                  <p class="text-secondary small mt-2 mb-0 ms-1">If enabled, users matching this profile cannot complete KYC without uploading this document.</p>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
              <button type="button" class="btn btn-light px-4 fw-bold shadow-none" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" [disabled]="!isFormValid()" (click)="saveMapping()">
                {{ isEditing ? 'Update Logic' : 'Establish Mapping' }}
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
      .cursor-pointer { cursor: pointer; }
    </style>
  `
})
export class SettingsMappingMatrixComponent implements OnInit {
  private masterDataService = inject(MasterDataService);

  matrix = signal<DocumentRequirement[]>([]);
  userTypes = signal<UserTypeMaster[]>([]);
  countries = signal<CountryMaster[]>([]);
  offices = signal<OfficeMaster[]>([]);
  docTypes = signal<DocumentTypeMaster[]>([]);

  searchQuery = signal<string>('');
  showModal = false;
  isEditing = false;

  activeMapping: DocumentRequirement = {
    user_type: 0,
    country: 0,
    office: 0,
    document_type: 0,
    is_mandatory: false
  };

  filteredMatrix = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.matrix().filter(m =>
      m.user_type_name?.toLowerCase().includes(query) ||
      m.country_name?.toLowerCase().includes(query) ||
      m.office_name?.toLowerCase().includes(query) ||
      m.document_type_name?.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.masterDataService.matrix$.subscribe(data => this.matrix.set(data));
    this.masterDataService.userTypes$.subscribe(data => this.userTypes.set(data));
    this.masterDataService.countries$.subscribe(data => this.countries.set(data));
    this.masterDataService.offices$.subscribe(data => this.offices.set(data));
    this.masterDataService.docTypes$.subscribe(data => this.docTypes.set(data));
  }

  isFormValid(): boolean {
    return (
      this.activeMapping.user_type > 0 &&
      this.activeMapping.country > 0 &&
      this.activeMapping.office > 0 &&
      this.activeMapping.document_type > 0
    );
  }

  openAddModal() {
    this.isEditing = false;
    this.activeMapping = {
      user_type: 0,
      country: 0,
      office: 0,
      document_type: 0,
      is_mandatory: false
    };
    this.showModal = true;
  }

  openEditModal(item: DocumentRequirement) {
    this.isEditing = true;
    this.activeMapping = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveMapping() {
    if (this.isEditing) {
      this.masterDataService.updateMapping(this.activeMapping).subscribe(() => this.closeModal());
    } else {
      this.masterDataService.addMapping(this.activeMapping).subscribe(() => this.closeModal());
    }
  }

  deleteMapping(id: number) {
    if (confirm('Are you sure you want to remove this requirement mapping?')) {
      this.masterDataService.deleteMapping(id).subscribe();
    }
  }

  downloadExcel() {
    const dataToExport = this.filteredMatrix().map(m => ({
      'User Type': m.user_type_name,
      'Country': m.country_name,
      'Office': m.office_name,
      'Document': m.document_type_name,
      'Mandatory': m.is_mandatory ? 'YES' : 'NO'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requirement Matrix');
    XLSX.writeFile(workbook, 'KYC_Requirement_Matrix.xlsx');
  }
}
