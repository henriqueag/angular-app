import { Component, inject } from "@angular/core";
import { PoButtonModule, PoPageAction, PoPageModule } from "@po-ui/ng-components";
import { environment } from "src/environments/environment";
import { SmartViewAuthService } from "./services/smart-view-auth.service";

@Component({
    selector: "app-integration",
    standalone: true,
    templateUrl: "./integration.component.html",
    styleUrl: "./integration.component.scss",
    imports: [PoPageModule, PoButtonModule],
    providers: [SmartViewAuthService],
})
export class IntegrationComponent {
    private _service = inject(SmartViewAuthService);

    pageActions: PoPageAction[] = [
        {
            label: "Abrir Smart View",
            url: environment.smartView.url,
        },
    ];

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this._service.destroyToken();
    }

    createToken() {
        this._service.createToken();
    }
}
