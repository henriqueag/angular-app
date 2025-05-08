import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { smartViewAuthInterceptor } from './integration/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([smartViewAuthInterceptor]), withInterceptorsFromDi()),
        importProvidersFrom(BrowserAnimationsModule)
    ]
};
