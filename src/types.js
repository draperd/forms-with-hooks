// @flow

export const SET_FIELD_OPTIONS_ACTION = "setFieldOptions";
export const REGISTER_FIELD_ACTION = "registerField";
export const UPDATE_FIELD_VALUE_ACTION = "updateFieldValue";

// TODO: At the moment a field can have any value, but we will want to constrain that in the future
export type FieldValue = any;

// TODO: At the moment the options for a field are just strings - but we'll want to make them a deeper object structure (for labels, values, headings, descriptions, etc)
export type FieldOptions = string[];

export type FieldDefinition = {|
  id: string,
  name: string,
  label: string,
  options?: FieldOptions,
  type: string,
  value?: FieldValue
|};
export type FieldDefinitions = FieldDefinition[];

// Field extends FieldDefinition to be used at runtime as it defines attributes that a developer shouldn't provide (like pendingOptions)
export type Field = {|
  ...FieldDefinition,
  pendingOptions?: Promise<FieldOptions>
|};

export type Fields = Field[];

export type FieldsReducerSetOptionsAction = {
  type: typeof SET_FIELD_OPTIONS_ACTION,
  payload: {
    id: string,
    options: FieldOptions
  }
};

export type FieldsReducerRegisterFieldAction = {
  type: typeof REGISTER_FIELD_ACTION,
  payload: {
    field: FieldDefinition
  }
};

export type FieldsReducerUpdateFieldValueAction = {
  type: typeof UPDATE_FIELD_VALUE_ACTION,
  payload: {
    id: string,
    value: FieldValue
  }
};
export type FieldsReducerActions =
  | FieldsReducerSetOptionsAction
  | FieldsReducerRegisterFieldAction
  | FieldsReducerUpdateFieldValueAction;

export type DispatchFormAction = FieldsReducerActions => void;

export type FieldRenderer = (Field, DispatchFormAction) => any;

export type FormState = {
  fields: Fields
};

export type FormContextType = {
  dispatch: DispatchFormAction,
  inheritedFormContext?: FormContextType,
  renderer: FieldRenderer,
  state: FormState
};
export type CreateFormContext = ({
  inheritedFormContext?: FormContextType,
  state: FormState,
  dispatch: DispatchFormAction,
  renderer?: FieldRenderer
}) => FormContextType;

export type FormProps = {
  children?: any,
  inheritedFormContext?: FormContextType,
  defaultFields?: FieldDefinitions,
  renderer?: FieldRenderer
};
