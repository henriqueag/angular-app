import { AsyncPipe, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { PoButtonModule, PoPageAction, PoPageModule } from "@po-ui/ng-components";
import { BehaviorSubject, first, Observable, Subscription, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { DynamicFormComponent } from "./components/dynamic-form/dynamic-form.component";
import { EmbeddedResourceEditingFlowComponent } from "./components/embedded-resource-editing-flow/embedded-resource-editing-flow.component";
import { Parameter } from "./models/parameter.model";
import { SmartViewCurrentUser } from "./models/smart-view-current-user.model";
import { SmartViewCurrentUserService } from "./services/smart-view-current-user.service";
import { SmartViewTokenEventsService } from "./services/smart-view-token-events.service";
import { SmartViewTokenService } from "./services/smart-view-token.service";

@Component({
    selector: "app-integration",
    standalone: true,
    templateUrl: "./integration.component.html",
    styleUrl: "./integration.component.scss",
    imports: [
        PoPageModule,
        PoButtonModule,
        NgIf,
        AsyncPipe,
        DynamicFormComponent,
        EmbeddedResourceEditingFlowComponent
    ]
})
export class IntegrationComponent {
    private _tokenService = inject(SmartViewTokenService);
    private _tokenEvents = inject(SmartViewTokenEventsService);
    private _currentUserService = inject(SmartViewCurrentUserService);
    private _httpClient = inject(HttpClient);
    private _subscriptions = new Subscription();

    pageActions: PoPageAction[] = [
        {
            label: "Novo Token",
            visible: true,
            action: this.createToken.bind(this),
        },
    ];

    currentUser$: Observable<SmartViewCurrentUser>;
    parameters$ = new BehaviorSubject<Parameter[]>([]);
    parametersLoaded$ = new BehaviorSubject<boolean>(false);
    hasSubtitle = false;

    ngOnInit(): void {
        this.currentUser$ = this._currentUserService
            .getCurrentUser$().pipe(tap((value) => (this.hasSubtitle = !!value)));

        this._subscriptions.add(
            this._tokenEvents.onTokenCreated$().subscribe(() => {
                this._currentUserService.loadCurrentUser();
                this.pageActions[0].label = "Carregar parâmetros";
                this.pageActions[0].action = this.loadParameters.bind(this);
            })
        );
    }

    ngOnDestroy(): void {
        this._tokenService.destroyToken();
        this._subscriptions.unsubscribe();
    }

    getSubtitle(value: SmartViewCurrentUser) {
        if (!value) return null;
        return `Bem vindo, ${value.displayName}`;
    }

    createToken() {
        this._tokenService.createToken();
    }

    loadParameters() {
        const { url, resource } = environment.smartView;
        const requestUrl = `${url}/api/resources/${resource.type}/${resource.id}/parameters`;

        this._httpClient.get<Parameter[]>(requestUrl).pipe(first()).subscribe((parameters) => {
            this.parameters$.next(parameters);
            this.parametersLoaded$.next(true);
        });
    }
}
