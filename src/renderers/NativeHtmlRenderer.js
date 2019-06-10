// @flow
import React from "react";
import { type FieldRenderer, UPDATE_FIELD_VALUE_ACTION } from "../types";

const nativeHtmlRenderer: FieldRenderer = (
  { id, label, name, value, type },
  dispatch
) => {
  switch (type) {
    default: {
      return (
        <div key={id}>
          <label htmlFor={id}>{label} </label>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={evt =>
              dispatch({
                type: UPDATE_FIELD_VALUE_ACTION,
                payload: { id, value: evt.target.value }
              })
            }
          />
        </div>
      );
    }
  }
};

export default nativeHtmlRenderer;
