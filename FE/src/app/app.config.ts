import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { LucideAngularModule, Search, LayoutDashboard, UserPlus, Settings, Moon, Sun, ArrowLeft, User, FileText, File, Upload, Check, MoreVertical, Building2, Globe, Users, GitPullRequest, MapPin, Plus, Trash2, Edit2, Download, Inbox, UploadCloud, Eye, RefreshCw, Loader, Cpu, Terminal } from 'lucide-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { routes } from './app.routes';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string = './assets/i18n/', private suffix: string = '.json') { }
  public getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Search, LayoutDashboard, UserPlus, Settings, Moon, Sun, ArrowLeft, User, FileText, File, Upload, Check, MoreVertical, Building2, Globe, Users, GitPullRequest, MapPin, Plus, Trash2, Edit2, Download, Inbox, UploadCloud, Eye, RefreshCw, Loader, Cpu, Terminal
      }),
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
