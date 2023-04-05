import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { Editor } from "primereact/editor";
import React from "react";
import { useSelector } from "react-redux";

interface IWorkOrderEditorProps {
  body: string;
  updateBody: (body: string) => void;
}

/**
 * Creates and handles the work order
 * Contains information about the work order such as the status, last updated time,
 * customer name, email, phone number, and their car information, the appointment time,
 * and who the work order is assigned to
 * Also includes a text field for any custom documentation necessary
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/08/2023
 * @param {IWorkOrderEditorProps} props - Work order editor props
 * @returns A react component for rendering a work order
 */
const WorkOrderEditor = (props: IWorkOrderEditorProps) => {
  const { body, updateBody } = props;
  const userType = useSelector(AuthSelectors.getUserType);

  const editorToolbar = () => {
    return (
      <div>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="0">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="0">Normal</option>
          </select>
          <select className="ql-font">
            <option></option>
            <option value="serif"></option>
            <option value="monospace"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" aria-label="Bold"></button>
          <button className="ql-italic" aria-label="Italic"></button>
          <button className="ql-underline" aria-label="Underline"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button
            type="button"
            className="ql-list"
            value="ordered"
            aria-label="Ordered List"
          ></button>
          <button
            type="button"
            className="ql-list"
            value="bullet"
            aria-label="Unordered List"
          ></button>
        </span>
        <span className="ql-formats">
          <button
            type="button"
            className="ql-clean"
            aria-label="Remove Styles"
          ></button>
        </span>
      </div>
    );
  };

  return (
    <Editor
      // Moving this to CSS file breaks it
      style={{ height: "50vh" }}
      value={body}
      onTextChange={(e) => updateBody(e.htmlValue ?? "")}
      headerTemplate={editorToolbar()}
      readOnly={userType === UserType.CUSTOMER}
    />
  );
};

export default React.memo(WorkOrderEditor);
