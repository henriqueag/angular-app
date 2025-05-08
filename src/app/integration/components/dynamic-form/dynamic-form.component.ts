import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, input, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { DynamicFormField } from "./dynamic-form.component.d";
import { DynamicFormService } from "./services/dynamic-form.service";

@Component({
    selector: "dynamic-form",
    standalone: true,
    templateUrl: "./dynamic-form.component.html",
    styleUrl: "./dynamic-form.component.scss",
    imports: [NgIf, NgFor, AsyncPipe],
    providers: [DynamicFormService]
})
export class DynamicFormComponent {
    private _service = inject(DynamicFormService);

    loadingLinesLength = Array.from({ length: 4 });
    parameters = input.required<DynamicFormField[]>();
    ready$: Observable<boolean>;

    ngOnInit(): void {
        this.ready$ = this._service.isReady$();
    }

    ngOnChanges() {
        this._service.initializeForm(this.parameters());
    }
}
