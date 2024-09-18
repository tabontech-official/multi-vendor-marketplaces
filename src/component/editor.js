import { convertToRaw, EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { Fragment } from "react";

export default function RTC({ editorState, onEditorStateChange, name }) {
  return (
    <>
      <p>{name}:</p>
      <div className='border border-gray-300  rounded w-auto'>
        <div>
          <Editor
            editorState={editorState}
            toolbarClassName="custom-toolbar " // Toolbar border
            wrapperClassName="wrapperClassName"
            editorClassName="custom-editor border border-gray-300 rounded-b" // Custom editor class
            onEditorStateChange={onEditorStateChange}
            mention={{
              separator: " ",
              trigger: "@",
              suggestions: [
                { text: "APPLE", value: "apple" },
                { text: "BANANA", value: "banana", url: "banana" },
                { text: "CHERRY", value: "cherry", url: "cherry" },
                { text: "DURIAN", value: "durian", url: "durian" },
                { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                { text: "FIG", value: "fig", url: "fig" },
                { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
              ]
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .custom-editor {
          height: 240px; /* Set height to 298px */
          overflow: hidden; /* Prevent horizontal scrolling */
        } 
        .custom-toolbar{
         width: auto; /* Set width to 653.48px */
        }
      `}</style>
    </>
  );
}
