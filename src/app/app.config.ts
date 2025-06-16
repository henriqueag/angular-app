import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";
import { smartViewAuthInterceptor } from "./integration/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(
            withInterceptors([smartViewAuthInterceptor]),
            withInterceptorsFromDi()
        ),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimations()
    ]
};
