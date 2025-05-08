import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SmartViewTokenService } from "../services/smart-view-token.service";

export const smartViewAuthInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(SmartViewTokenService);
    const token = authService.getToken();

    if (!token) {
        return next(request);
    }

    request = request.clone({
        headers: request.headers.set("Authorization", `${token.token_type} ${token.access_token}`)
    });

    return next(request);
};
