import { Injectable } from "@angular/core";
import { DynamicFormField } from "../dynamic-form.component.d";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DynamicFormService {
    private _fields: DynamicFormField[] = [];
    private _ready$ = new BehaviorSubject<boolean>(false);

    initializeForm(fields: DynamicFormField[]) {
        if (!fields) return;

        this._ready$.next(false);

        this._fields = [];

        this.initializeFields(fields);
    }

    isReady$() {
        return this._ready$.asObservable();
    }

    private initializeFields(fields: DynamicFormField[]) {
        const fieldsMap = new Map<string, DynamicFormField>(fields.map(field => [field.name, field]));

        for (const field of fieldsMap.values()) {
            if (field.category === "Group") {
                this.initializeFields(field.items ?? []);
                continue;
            }

            if (field.category !== "Parameter") continue;

            field.isDisabledByDependency = false;
            field.unfilledDependentFields = [];
            field.filterDependencies ??= [];

            field.filterDependencies.forEach((fd) => fd.parameter = fieldsMap.get(fd.name) ?? null);

            this._fields.push(field);
        }
    }
}
