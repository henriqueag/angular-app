import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, first, interval, Subject, Subscription, switchMap, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { SmartViewAuthToken } from '../models/smart-view-auth-token.model';
import { SmartViewTokenEventsService } from "./smart-view-token-events.service";

@Injectable({
    providedIn: "root"
})
export class SmartViewTokenService {
    private _token$ = new BehaviorSubject<SmartViewAuthToken>(null);
    private _httpClient = inject(HttpClient);
    private _tokenEvents = inject(SmartViewTokenEventsService);
    private _subscriptions = new Subscription();
    private _refreshTimeout: any = null;

    getToken = () => this._token$.getValue();

    createToken() {
        if (!this.isTokenExpired()) {
            console.warn("O token não está expirado.");
            return;
        }

        const url = `${environment.smartView.url}/api/security/v1/token`;
        const body = new URLSearchParams({
            GrantType: "password",
            Username: environment.smartView.username,
            Password: environment.smartView.password
        });
        const options = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        this._httpClient.post<SmartViewAuthToken>(url, body.toString(), options)
            .pipe(first(), catchError(error => this.onTokenError(error)))
            .subscribe(token => {
                token.expires_at = new Date().setSeconds(token.expires_in);
                this._token$.next(token);
                this._tokenEvents.setTokenCreated();
                this.setupAutoRefreshToken();
            });
    }

    destroyToken() {
        this._token$.next(null);
        this._tokenEvents.setTokenDestroyed();
        this._subscriptions.unsubscribe();
        if (this._refreshTimeout) {
            clearTimeout(this._refreshTimeout);
            this._refreshTimeout = null;
        }
    }

    private refreshToken() {
        const token = this._token$.getValue();

        if (!token) {
            return throwError(() => Error("Nenhum token de acesso encontrado para ser atualizado"));
        }

        const url = `${environment.smartView.url}/api/security/v1/token`;
        const body = new URLSearchParams({
            GrantType: "refresh_token",
            RefreshToken: token.refresh_token
        });
        const options = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        return this._httpClient.post<SmartViewAuthToken>(url, body.toString(), options)
            .pipe(
                first(),
                catchError(error => this.onTokenError(error)),
                tap((token) => {
                    token.expires_at = new Date().setSeconds(token.expires_in);
                    this._token$.next(token);
                    this.setupAutoRefreshToken();
                })
            );
    }

    private setupAutoRefreshToken() {
        if (this.isTokenExpired()) return;

        const now = new Date();
        const expirationDate = new Date(this._token$.getValue().expires_at ?? 0);

        const expiresIn = (expirationDate.getTime() - now.getTime()) / 1000;
        const refreshIn = Math.max(0, expiresIn - 300) * 1000;

        if (refreshIn > 0) {
            console.log(`Próxima execução de refreshToken em ${(refreshIn / 1000) / 60} minutos`);

            this._refreshTimeout = setTimeout(() => {
                this._subscriptions.add(
                    this.refreshToken().subscribe({
                        error: (error) => console.error('Auto-refresh failed', error)
                    })
                );
            }, refreshIn);
        }
    }

    private onTokenError(error: any) {
        this._token$.next(null);
        return throwError(() => error);
    }

    private isTokenExpired() {
        const token = this._token$.getValue();
        return !token || new Date().getTime() > new Date(token.expires_at ?? 0).getTime();
    }
}

