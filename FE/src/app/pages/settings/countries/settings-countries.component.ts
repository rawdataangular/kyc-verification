import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Country {
    id: string;
    name: string;
    code: string;
    dial_code: string;
}

@Component({
    selector: 'app-settings-countries',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1">Global Regions</h3>
          <p class="text-secondary small fw-medium mb-0">Manage registered countries and regions.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm">
          <i-lucide name="plus" style="width: 18px;"></i-lucide>
          <span>Add Country</span>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Country Name</th>
              <th>Abbreviation (Alpha-3)</th>
              <th>Dialing Code</th>
              <th class="text-end pe-4">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (country of countries(); track country.id) {
              <tr>
                <td>
                  <div class="d-flex align-items-center fw-bold">
                    <span class="rounded-circle bg-light d-inline-flex justify-content-center align-items-center me-3" style="width: 38px; height: 38px;">
                      <i-lucide name="globe" style="width: 18px; color: #94a3b8;"></i-lucide>
                    </span>
                    {{ country.name }}
                  </div>
                </td>
                <td><code>{{ country.code }}</code></td>
                <td><span class="fw-bold text-primary">+{{ country.dial_code }}</span></td>
                <td class="text-end pe-4">
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
export class SettingsCountriesComponent {
    countries = signal<Country[]>([
        { id: '1', name: 'India', code: 'IND', dial_code: '91' },
        { id: '2', name: 'United States', code: 'USA', dial_code: '1' },
        { id: '3', name: 'United Kingdom', code: 'GBR', dial_code: '44' },
        { id: '4', name: 'United Arab Emirates', code: 'ARE', dial_code: '971' }
    ]);
}
