import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, first } from "rxjs";
import { environment } from "src/environments/environment";
import { SmartViewCurrentUser } from "../models/smart-view-current-user.model";
import { SmartViewTokenEventsService } from "./smart-view-token-events.service";

@Injectable({
    providedIn: "root"
})
export class SmartViewCurrentUserService {
    private _currentUser$ = new BehaviorSubject<SmartViewCurrentUser>(null);
    private _httpClient = inject(HttpClient);
    private _tokenEvents = inject(SmartViewTokenEventsService);

    getCurrentUser() {
        return this._currentUser$.getValue();
    }

    getCurrentUser$() {
        return this._currentUser$.asObservable();
    }

    loadCurrentUser() {
        const url = `${environment.smartView.url}/api/security/current-user`;

        return this._httpClient.get<SmartViewCurrentUser>(url).pipe(first())
            .subscribe((value) => {
                this._currentUser$.next(value);
                this._tokenEvents.onTokenDestroyed$()
                    .subscribe(() => this._currentUser$.next(null));
            });
    }
}
