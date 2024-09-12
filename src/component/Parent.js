import React, { useState } from "react";
import RTC from "./editor";
import AddNewEquipmentForm from "../pages/New_Equipment_listing";
export default function ParentComponent() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [text, setText] = useState("");

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setText(currentText);
  };

  return (
    <div>
      <RTC
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
      <AddNewEquipmentForm description={text} />
    </div>
  );
}