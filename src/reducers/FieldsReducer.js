// @flow

import {
  type FormState,
  type Field,
  type FieldValue,
  type FieldsReducerActions,
  type FieldsReducerRegisterFieldAction,
  type FieldsReducerUpdateFieldValueAction,
  type FieldsReducerSetOptionsAction,
  SET_FIELD_OPTIONS_ACTION,
  REGISTER_FIELD_ACTION,
  UPDATE_FIELD_VALUE_ACTION
} from "../types";

function initFieldsReducer({ fields }: FormState) {
  fields.forEach(field => {
    field.hasBeenTouched = false;
    field.isValid = true;
    field.isDiscretelyInvalid = false;
    field.validationErrorMessage = "";
  });
  return { fields };
}

const registerField = (
  state: FormState,
  action: FieldsReducerRegisterFieldAction
): FormState => {
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
  return {
    ...state,
    fields: [
      ...fields,
      {
        ...field,
        hasBeenTouched: false,
        isValid: true,
        isDiscretelyInvalid: false,
        validationErrorMessage: ""
      }
    ]
  };
};

const setFieldOptions = (
  state: FormState,
  action: FieldsReducerSetOptionsAction
): FormState => {
  return state;
};

type FieldValidationStateChangedArgument = {
  field: Field,
  isValid: boolean,
  isDiscretelyInvalid: boolean,
  validationErrorMessage: string
};
type FieldValidationStateChanged = FieldValidationStateChangedArgument => boolean;

export const fieldValidationStateChanged: FieldValidationStateChanged = ({
  field,
  isValid,
  isDiscretelyInvalid,
  validationErrorMessage
}) => {
  if (
    field.isValid === isValid &&
    field.isDiscretelyInvalid === isDiscretelyInvalid &&
    field.validationErrorMessage === validationErrorMessage
  ) {
    return false;
  }
  return true;
};

export const hasValue = (value: FieldValue): boolean => {
  const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
  const hasValue =
    (value || value === 0 || value === false) && !valueIsEmptyArray;
  return hasValue;
};

const validateField = (state: FormState, field: Field): Field => {
  // Only return a different field object if the validation state HAS CHANGED

  let isValid = true;
  let isDiscretelyInvalid = false;
  let validationErrorMessage = "";

  const { hasBeenTouched, required, value, visible } = field;
  if (!visible) {
    // If not visible then assume to be valid (use defaults)
  } else if (required && !hasValue(value)) {
    // If the field is required but has no value then it is invalid
    isValid = false;
    const { missingRequiredValueMessage = "A value must be provided" } = field;
    validationErrorMessage = missingRequiredValueMessage;
  }

  // TODO: Run all validators
  // TODO: Run validation handler
  // - Consider async validation

  // If the field has not been touched and is invalid then indicate that it
  // is actually discretely invalid (so that the submit button can be disabled
  // without showing an error message on the field - we need to give the user a
  // chance!)
  if (!hasBeenTouched && !isValid) {
    isDiscretelyInvalid = true;
  }

  if (
    fieldValidationStateChanged({
      field,
      isValid,
      isDiscretelyInvalid,
      validationErrorMessage
    })
  ) {
    // If the validation state has changed for the field then return a new
    // object with the new validation values assigned
    return {
      ...field,
      isValid,
      isDiscretelyInvalid,
      validationErrorMessage
    };
  }
  return field;
};

const validateAllFields = (state: FormState): FormState => {
  // Iterate over all fields and validate each one of them
  let { fields } = state;

  // TODO: The problem here is that we're ALWAYS returning a new fields array
  //       which might not actually be necessary if none of the fields validation
  //       state has changed. Ideally we would only return a new array if any
  //       field validation state is different.
  fields = fields.map(field => validateField(state, field));
  return { ...state, fields };
};

const updateFieldValue = (
  state: FormState,
  action: FieldsReducerUpdateFieldValueAction
): FormState => {
  const { id, value } = action.payload;
  const { fields } = state;
  const field = fields.find(field => field.id === id);
  if (field) {
    field.value = value;
    // TODO: Create new fields array?

    // TODO: Should also update the overall form state,
    //       - overall value
    //       - validity
    //       - etc
    validateAllFields(state);

    // NOTE: Need to return a new object to trigger re-render
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
