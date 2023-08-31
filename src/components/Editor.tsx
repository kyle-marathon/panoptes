export default function Editor() {
  return <div>settings</div>;
}

// import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import { db } from "../setup/setupFirebase";
// import { set, ref } from "firebase/database";
// import { useRecoilValue } from "recoil";

// import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";
// import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
// import IconTitle from "@airbnb/lunar-icons/lib/general/IconTitle";
// import IconChevronDown from "@airbnb/lunar-icons/lib/interface/IconChevronDown";
// import IconChevronUp from "@airbnb/lunar-icons/lib/interface/IconChevronUp";

// import toRGBA from "@airbnb/lunar/lib/utils/toRGBA";
// import { uidState } from "../atoms";

// import { Content, Item } from "../utils/types";

// export const editorStyleSheet: any = ({ color, unit }: any) => {
//   const stylesObj: any = {
//     editor_content_wrap: {},
//     editor_wrap_hide_toolbar: {
//       "@selectors": {
//         "> span > .editor > .ql-toolbar": {
//           display: "none",
//         },
//       },
//     },
//     editor_wrap_max_height: {
//       display: "block",
//       maxHeight: 24,
//       overflow: "scroll",
//       "::-webkit-scrollbar": {
//         display: "none",
//       },
//     },
//     input_completed: {
//       "@selectors": {
//         "> span > .editor  > .ql-container > .ql-editor": {
//           textDecoration: "line-through",
//         },
//       },
//     },
//     editor_wrap: {
//       width: "100%",
//       position: "relative",
//       "@selectors": {
//         "> span > .editor > .ql-toolbar": {
//           border: "none",
//           borderBottom: `1px solid ${toRGBA(color.accent.border, 50)}`,
//           marginBottom: unit,
//           marginLeft: -1.5 * unit,
//           paddingTop: 0,
//         },
//         "> span > .editor > .ql-container": {
//           width: "100%",
//           border: "none",
//           fontSize: 15,
//         },

//         "> span > .editor  > .ql-container > .ql-editor": {
//           padding: 0,
//         },

//         "> span > .editor  > .ql-container > .ql-editor > h1": {
//           fontSize: "1.8em",
//         },

//         "> span > .editor  > .ql-container > .ql-editor > h2": {
//           fontSize: "1.3rem",
//         },

//         "> span > .editor  > .ql-container > .ql-editor > ul": {
//           paddingLeft: "0em",
//         },

//         "> span > .editor > .ql-container > .ql-editor > ul > li:before": {
//           paddingRight: "0.25em",
//         },
//       },
//     },
//   };

//   [1, 2, 3, 4, 5, 6, 7, 8].forEach((x) => {
//     stylesObj.editor_wrap["@selectors"][
//       `> span > .editor  > .ql-container > .ql-editor > ul > li.ql-indent-${x}`
//     ] = { paddingLeft: `${1.5 * (x + 1)}em` };
//   });

//   return stylesObj;
// };

// type EditorProps = {
//   content: Content;
//   onChange: (value: string) => void;
//   collapsed?: boolean;
//   hideToolbar?: boolean;
//   extraHiddenButtons?: JSX.Element;
//   isCompleted?: boolean;
//   onBlur?: () => void;
//   onFocus?: () => void;
//   onKeyDown?: (e: KeyboardEvent) => void;
// };

// export default function Editor({
//   content,
//   onChange,
//   isCompleted,
//   collapsed,
//   hideToolbar,
//   ...restProps
// }: EditorProps) {
//   const [styles, cx] = useStyles(editorStyleSheet);

//   const uid = useRecoilValue(uidState);

//   return typeof content == "string" ? (
//     <div
//       className={cx(
//         styles.editor_wrap,
//         (hideToolbar || collapsed) && styles.editor_wrap_hide_toolbar,
//         isCompleted && styles.input_completed
//       )}
//     >
//       <span className={cx(collapsed && styles.editor_wrap_max_height)}>
//         <ReactQuill
//           className="editor"
//           theme="snow"
//           value={content}
//           modules={{
//             keyboard: { bindings: { tab: false } },
//             clipboard: {
//               matchVisual: false,
//             },
//             toolbar: [
//               [{ list: "ordered" }, { list: "bullet" }],
//               [{ script: "sub" }, { script: "super" }], // superscript/subscript

//               [{ align: [] }],

//               ["blockquote", "code-block"],

//               ["clean"],

//               [{ header: 1 }, { header: 2 }],
//             ],
//           }}
//           onChange={(value) => onChange(value)}
//           {...restProps}
//         />
//       </span>
//     </div>
//   ) : (
//     <></>
//   );
// }
