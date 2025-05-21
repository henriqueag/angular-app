import { NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { PoDropdownModule, PoFieldModule, PoSelectOption } from "@po-ui/ng-components";
import { first, map, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { SmartViewTokenService } from "../../services/smart-view-token.service";

@Component({
    selector: "embedded-resource-editing-flow",
    standalone: true,
    templateUrl: "./embedded-resource-editing-flow.component.html",
    styleUrl: "./embedded-resource-editing-flow.component.scss",
    imports: [FormsModule, PoFieldModule, PoDropdownModule, NgIf]
})
export class EmbeddedResourceEditingFlowComponent {
    private _httpClient = inject(HttpClient);
    private _tokenService = inject(SmartViewTokenService);
    private _sanitizer = inject(DomSanitizer);

    selectedType: string = "report";
    selectOptions: PoSelectOption[] = [
        { label: "Relatório", value: "report" },
        { label: "Tabela dinâmica", value: "pivot-table" },
        { label: "Visão de dados", value: "data-grid" },
    ];

    resourceId: string;
    resources: PoSelectOption[] = [];
    editorUrl: SafeResourceUrl;

    ngOnInit(): void {
        this.onLoadResourcesByType();
    }

    onLoadResourcesByType() {
        const url = `${environment.smartView.url}/api/resources/v1/all`;
        const queryParams = { resourceType: this.selectedType };
        this._httpClient.get<any[]>(url, { params: queryParams })
            .pipe(
                first(),
                map((resources) => resources.map((({ id, displayName }) => ({ value: id, label: displayName })))),
                tap(value => console.log(value))
            )
            .subscribe(value => this.resources = [...value]);
    }

    onResourceSelected() {
        const { token_type, access_token, refresh_token, expires_in } = this._tokenService.getToken();
        const key = `${this.selectedType}.editor`;
        const requestUrl = `${environment.smartView.url}/api/resources/v1/hyperlinks/${key}`;
        const queryParams = {
            resourceId: this.resourceId,
            tokenType: token_type,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in
        };

        this._httpClient.get(requestUrl, { params: queryParams, responseType: "text" }).pipe(first())
            .subscribe(value => this.editorUrl = this._sanitizer.bypassSecurityTrustResourceUrl(value.replace("7027", "7049")));
    }
}
