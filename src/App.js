import React from "react";
import Form from "./components/Form";
import FormFragment from "./components/FormFragment";
import "./App.css";
import { type FieldDefinitions } from "./components/Form";

const defaultFields: FieldDefinitions = [
  {
    id: "1",
    name: "name",
    type: "text",
    label: "Test"
  },
  {
    id: "2",
    name: "description",
    type: "text",
    label: "Another"
  }
];

function App() {
  return (
    <div className="App">
      Form goes here
      <div>
        <Form defaultFields={defaultFields} />
        <Form>
          <FormFragment defaultFields={defaultFields} />
        </Form>
      </div>
    </div>
  );
}

export default App;
