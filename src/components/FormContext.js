// @flow
import React from "react";
import { type CreateFormContext } from "../types";
import nativeHtmlRenderer from "../renderers/NativeHtmlRenderer";

// $FlowFixMe
export default React.createContext();

export const createFormContext: CreateFormContext = ({
  inheritedFormContext,
  state,
  dispatch,
  renderer
}) => ({
  inheritedFormContext,
  state,
  dispatch,
  renderer: renderer || nativeHtmlRenderer
});
