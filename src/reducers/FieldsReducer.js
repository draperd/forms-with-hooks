// @flow
import {
  type FormState,
  type FieldsReducerActions,
  type FieldsReducerRegisterFieldAction,
  type FieldsReducerUpdateFieldValueAction,
  type FieldsReducerSetOptionsAction,
  SET_FIELD_OPTIONS_ACTION,
  REGISTER_FIELD_ACTION,
  UPDATE_FIELD_VALUE_ACTION
} from "../types";

function initFieldsReducer({ fields }: FormState) {
  // TODO: This reducer init function should register the fields as part of the setup
  return { fields };
}

const registerField = (
  state: FormState,
  action: FieldsReducerRegisterFieldAction
) => {
  const { field } = action.payload;
  const { fields } = state;
  const fieldIsRegistered = fields.find(
    existingField => field.id === existingField.id
  );
  if (fieldIsRegistered) {
    return state;
  }
  // TODO: needed to spread the field when registering - needs deep clone really
  //       to avoid issues with attributes that are complex objects
  return { ...state, fields: [...fields, { ...field }] };
};

const setFieldOptions = (
  state: FormState,
  action: FieldsReducerSetOptionsAction
) => {
  return state;
};

const updateFieldValue = (
  state: FormState,
  action: FieldsReducerUpdateFieldValueAction
) => {
  const { id, value } = action.payload;
  const { fields } = state;
  const field = fields.find(field => field.id === id);
  if (field) {
    field.value = value;
    // TODO: Create new fields array?
    // NOTE: Need to return a new object to trigger re-render

    // TODO: Should also update the overall form state,
    //       - overall value
    //       - validity
    //       - etc
    return { ...state };
  }
  return state;
};

function fieldsReducer(state: FormState, action: FieldsReducerActions) {
  switch (action.type) {
    case SET_FIELD_OPTIONS_ACTION: {
      return setFieldOptions(state, action);
    }
    case REGISTER_FIELD_ACTION: {
      return registerField(state, action);
    }
    case UPDATE_FIELD_VALUE_ACTION: {
      return updateFieldValue(state, action);
    }
    default:
      return state;
  }
}

export { initFieldsReducer, fieldsReducer };
