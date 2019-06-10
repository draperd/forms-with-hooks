// $Flow
import React from "react";
import FormContext from "./FormContext";
import {
  type FormFragmentProps,
  type FieldDefinitions,
  type Fields,
  type DispatchFormAction,
  REGISTER_FIELD_ACTION
} from "../types";

const registerFields = (
  fields: FieldDefinitions,
  dispatch: DispatchFormAction
) => {
  fields.forEach(field =>
    dispatch({ type: REGISTER_FIELD_ACTION, payload: { field } })
  );
};

const getRegisteredFragmentFields = (
  fields: Fields,
  fragmentFieldDefinitions: FieldDefinitions
) =>
  fields.filter(field =>
    fragmentFieldDefinitions.find(
      fragmentFieldDefinition => fragmentFieldDefinition.id === field.id
    )
  );

export default function FormFragment(props: FormFragmentProps) {
  const { defaultFields = [] } = props;

  return (
    <FormContext.Consumer>
      {formContext => {
        const {
          state: { fields },
          dispatch,
          renderer
        } = formContext;

        registerFields(defaultFields, dispatch);

        return getRegisteredFragmentFields(fields, defaultFields).map(field =>
          renderer(field, dispatch)
        );
      }}
    </FormContext.Consumer>
  );
}
