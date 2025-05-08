import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SmartViewTokenEventsService {
    private _tokenCreated$ = new Subject<void>();
    private _tokenDestroyed$ = new Subject<void>();

    setTokenCreated() {
        this._tokenCreated$.next();
    }

    onTokenCreated$() {
        return this._tokenCreated$.asObservable();
    }

    setTokenDestroyed() {
        this._tokenDestroyed$.next();
    }

    onTokenDestroyed$() {
        return this._tokenDestroyed$.asObservable();
    }
}
