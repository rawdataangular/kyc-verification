import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KycDetailComponent } from './pages/kyc-detail/kyc-detail.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsGeneralComponent } from './pages/settings/general/settings-general.component';
import { SettingsOfficesComponent } from './pages/settings/offices/settings-offices.component';
import { SettingsCountriesComponent } from './pages/settings/countries/settings-countries.component';
import { SettingsDocTypesComponent } from './pages/settings/doc-types/settings-doc-types.component';
import { SettingsMappingMatrixComponent } from './pages/settings/mapping-matrix/settings-mapping-matrix.component';
import { SettingsUserTypesComponent } from './pages/settings/user-types/settings-user-types.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'kyc/new', component: KycDetailComponent },
    { path: 'kyc/:id', component: KycDetailComponent },
    {
        path: 'settings',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: SettingsGeneralComponent },
            { path: 'offices', component: SettingsOfficesComponent },
            { path: 'countries', component: SettingsCountriesComponent },
            { path: 'doc-types', component: SettingsDocTypesComponent },
            { path: 'mapping-matrix', component: SettingsMappingMatrixComponent },
            { path: 'user-types', component: SettingsUserTypesComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
