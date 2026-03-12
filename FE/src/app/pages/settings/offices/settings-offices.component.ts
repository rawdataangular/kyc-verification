import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Office {
    id: string;
    name: string;
    location: string;
    code: string;
    status: 'active' | 'inactive';
}

@Component({
    selector: 'app-settings-offices',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1">Branch Offices</h3>
          <p class="text-secondary small fw-medium mb-0">Manage registered branches across countries.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm">
          <i-lucide name="plus" style="width: 18px;"></i-lucide>
          <span>Add Office</span>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Office Name</th>
              <th>Location</th>
              <th>Branch Code</th>
              <th>Status</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (office of offices(); track office.id) {
              <tr>
                <td>
                  <div class="fw-bold">{{ office.name }}</div>
                  <div class="small text-secondary">{{ office.id }}</div>
                </td>
                <td>{{ office.location }}</td>
                <td><code>{{ office.code }}</code></td>
                <td>
                   <span class="badge rounded-pill fw-bold" [ngClass]="{'bg-success-subtle text-success': office.status === 'active', 'bg-secondary-subtle text-secondary': office.status === 'inactive'}">
                     {{ office.status | uppercase }}
                   </span>
                </td>
                <td class="text-end">
                   <button class="btn btn-sm btn-link text-primary fw-bold text-decoration-none">Edit</button>
                   <button class="btn btn-sm btn-link text-danger fw-bold text-decoration-none ms-2">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SettingsOfficesComponent {
    offices = signal<Office[]>([
        { id: 'OFF001', name: 'Corporate HQ', location: 'USA, New York', code: 'US-NY-HQ-01', status: 'active' },
        { id: 'OFF002', name: 'Mumbai Regional Office', location: 'India, Mumbai', code: 'IN-MU-RO-02', status: 'active' },
        { id: 'OFF003', name: 'London Finance Center', location: 'UK, London', code: 'UK-LO-FC-03', status: 'active' }
    ]);
}
