// @flow

import React, { useReducer } from "react";
import FormContext, { createFormContext } from "./FormContext";
import FormFragment from "./FormFragment";
import {
  type Fields,
  type FormProps,
  SET_FIELD_OPTIONS_ACTION
} from "../types";
import { fieldsReducer, initFieldsReducer } from "../reducers/FieldsReducer";

function Form(props: FormProps) {
  const { children, inheritedFormContext, defaultFields = [] } = props;

  // NOTE: This type of casting is NOT recommended, but is a workaround
  //       to cast from something less specific to more specific
  //       See: https://flow.org/en/docs/types/casting/
  //       However, it's used here because we know that the additional attributes
  //       in Field are optional
  const initFields: Fields = ((defaultFields: any): Fields);

  const [state, dispatch] = useReducer(
    fieldsReducer,
    { fields: initFields },
    initFieldsReducer
  );

  const { fields } = state;

  // TODO: This could be a function in it's own right
  fields.forEach((field, index) => {
    const { id, pendingOptions } = field;
    if (pendingOptions) {
      pendingOptions.then(options =>
        dispatch({ type: SET_FIELD_OPTIONS_ACTION, payload: { id, options } })
      );
    }
  });

  // By including the state and the dispatch function in the context any component has the ability to
  // dispatch any actions (for example a field can register itself or report that it's value has changed, etc)
  const formContext = createFormContext({
    inheritedFormContext,
    state,
    dispatch
  });

  return (
    <FormContext.Provider value={formContext}>
      {defaultFields && <FormFragment defaultFields={defaultFields} />}
      {children}
    </FormContext.Provider>
  );
}

export default Form;
