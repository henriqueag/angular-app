import { Parameter } from "../../models/parameter.model";

export interface DynamicFormField extends Parameter {
    value?: any;
    visibility?: DynamicFormFieldVisibilityType;
    optionsUrl?: string;
    optionsData?: DynamicFormFieldOptions[];
    lookupUrl?: string;
    lookupData?: DynamicFormFieldOptions[];
    isDisabledByDependency?: boolean;
    unfilledDependentFields?: string[];
}

export type DynamicFormFieldVisibilityType = "Default" | "Hidden" | "Disabled";

export interface DynamicFormFieldOptions {
    type?: DynamicFormFieldOptionsType;
    keyProperty?: string;
    data: object[];
    descriptor?: object;
}

export type DynamicFormFieldOptionsType = "None" | "Select" | "Lookup";
