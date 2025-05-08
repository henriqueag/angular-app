export interface Parameter {
    id: string;
    name?: string;
    displayName: string;
    type: ParameterType;
    multiValue?: boolean;
    lookup: ParameterOptionsSupport;
    options: ParameterOptionsSupport;
    order: number;
    description?: string;
    origin: ParameterOrigin;
    category: ParameterCategory;
    defaultValue?: any;
    userPreferenceValue?: any;
    allowNull?: boolean;
    visible?: boolean;
    expandGroup?: boolean;
    inputMaxLength?: boolean;
    multiValueItems?: ParameterMultiValueItem[];
    listType: ParameterListType;
    staticListItems?: ParameterStaticListItem[];
    items?: Parameter[];
    businessObjectFilterId?: string;
    filterDependencies?: ParameterFilterDependency[];
}

export type ParameterType = "string" | "number" | "date" | "boolean";

export type ParameterOrigin = "BusinessObject" | "Filter" | "Design";

export type ParameterCategory = "Group" | "Separator" | "Parameter";

export type ParameterOptionsSupport = "Supported" | "NotSupported";

export type ParameterListType = "None" | "Static";

export interface ParameterMultiValueItem {
    label: string;
    value: string;
}

export interface ParameterStaticListItem extends ParameterMultiValueItem {
    isDefault: boolean;
}

export interface ParameterFilterDependency {
    name: string;
    isRequired: boolean;
    parameter?: Parameter
}
