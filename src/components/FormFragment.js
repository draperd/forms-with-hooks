// $Flow
import React from "react";
import FormContext from "./FormContext";
import { REGISTER_FIELD_ACTION } from "../types";

export type FormFragmentProps = {
  defaultFields?: FieldDefinitions
};

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

        defaultFields.forEach(field =>
          dispatch({ type: REGISTER_FIELD_ACTION, payload: { field } })
        );

        const fragmentFields = fields.filter(field =>
          defaultFields.find(defaultField => defaultField.id === field.id)
        );

        return fragmentFields.map(field => renderer(field, dispatch));
      }}
    </FormContext.Consumer>
  );
}
