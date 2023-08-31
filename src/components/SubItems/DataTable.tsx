export default function DataTable() {
  return <div>settings</div>;
}

// import { useState } from "react";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import { useRecoilValue, useRecoilState } from "recoil";

// import { set, update, ref, remove } from "firebase/database";
// import { db, hasItemsPath } from "../../setup/setupFirebase";

// import Table, { RendererProps } from "@airbnb/lunar/lib/components/DataTable";
// import Button from "@airbnb/lunar/lib/components/Button";
// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import Card from "@airbnb/lunar/lib/components/Card";
// import SubItemCard from "./SubItemCard";

// import IconButton from "@airbnb/lunar/lib/components/IconButton";
// import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
// import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

// import Row from "../Row";
// import HiddenButtons, { HiddenButton } from "../HiddenButtons";
// import Input from "../Input";

// import { TableData, TableDataRow, UpdateData } from "../../utils/types";
// import { uidState, pkdState } from "../../atoms";

// type DataTableProps = {
//   content: TableData;
//   setNewValue: (newValue: any, field: string | (string | number)[]) => void;
//   taskId: string;
//   subtaskId: string;
// };

// export const tableStyleSheet: StyleSheet = ({ color, font, unit }) => ({
//   expand_icon: {
//     "@selectors": {
//       "> svg": {
//         transform: "rotate(90deg)",
//       },
//     },
//   },
//   input_wrap: {
//     "@selectors": {
//       " > input": {
//         ":focus": {
//           outlineColor: color.core.primary[3],
//           outlineStyle: "solid",
//           outlineOffset: -2,
//         },
//         border: `1px solid ${color.accent.border}`,
//         width: "-webkit-fill-available",
//         marginTop: -1,
//         marginRight: -1,
//         padding: "6px 12px 6px 12px",
//       },
//     },
//   },
//   table: {
//     tableLayout: "fixed",
//     borderCollapse: "collapse",
//     "@selectors": {
//       "> tbody > tr > td > input": {
//         width: "100%",
//       },
//       "> tbody > tr > td": {
//         padding: 0,
//         position: "relative",
//       },
//       "> thead > tr > th": {
//         textAlign: "left",
//         padding: 0,
//         position: "relative",
//       },
//       "> tbody > tr > td, > thead > tr > th": {
//         // padding: "4px 12px 4px 12px",
//       },
//     },
//   },
// });

// export default function DataTable({
//   setNewValue,
//   content,
//   taskId,
//   subtaskId,
// }: DataTableProps) {
//   const [styles, cx] = useStyles(tableStyleSheet);
//   const [newCol, setNewCol] = useState("");
//   const [tempColName, setTempColName] = useState("");
//   const [focused, setFocused] = useState(-1);
//   const [hoveredCell, setHoveredCell] = useState([-1, -1]);
//   const uid = useRecoilValue(uidState);

//   if (
//     content == undefined ||
//     content[0] == undefined ||
//     content[0].data == undefined ||
//     typeof content == "string"
//   ) {
//     return <></>;
//   }

//   const tableCols = Object.keys(content[0].data);
//   const tableValues = Object.values(content);
//   const tableRowIds = tableValues.map((value) => value.rowId);
//   const largestRowId = Math.max(...tableRowIds);

//   const tableHeader = (
//     <tr>
//       {tableCols.map((key, idx) => (
//         <th key={`th-${key}`} onMouseEnter={() => setHoveredCell([0, idx])}>
//           <HiddenButtons isHidden={idx != hoveredCell[1]} position="top">
//             <>
//               {/* <HiddenButton onClick={() => {}}>
//                 <div className={cx(styles.expand_icon)}>
//                   <IconExpand accessibilityLabel="drag" />
//                 </div>
//               </HiddenButton> */}
//               <HiddenButton
//                 onClick={() => {
//                   if (tableCols.length == 1) {
//                     setNewValue(null, [taskId, "subtasks", subtaskId]);
//                   } else {
//                     const newContent: TableData = {};
//                     tableRowIds.forEach(
//                       (rowId) =>
//                         (newContent[rowId] = { rowId: rowId, data: {} })
//                     );
//                     tableValues.forEach(({ data, rowId }) => {
//                       const { [key]: oldContentValue, ...newContentValue } =
//                         data;
//                       newContent[rowId].data = newContentValue;
//                     });

//                     setNewValue(newContent, [
//                       taskId,
//                       "subtasks",
//                       subtaskId,
//                       "title",
//                     ]);
//                   }
//                 }}
//               >
//                 <IconClose accessibilityLabel="drag" />
//               </HiddenButton>
//             </>
//           </HiddenButtons>
//           <div
//             className={cx(styles.input_wrap, {
//               borderRadius: 10,
//             })}
//           >
//             <input
//               className={cx(
//                 idx == 0 && {
//                   borderTopLeftRadius: 4,
//                 },
//                 idx == tableCols.length - 1 && {
//                   borderTopRightRadius: 4,
//                 }
//               )}
//               value={focused == idx ? tempColName : key}
//               onFocus={() => {
//                 setFocused(idx);
//                 setTempColName(key);
//               }}
//               onChange={({ target: { value } }) => {
//                 setTempColName(value);
//               }}
//               onBlur={() => {
//                 if (tempColName.length > 0) {
//                   const newKey = tempColName;
//                   const newContent = { ...content };
//                   tableRowIds.forEach((rowId) => {
//                     const rowData = content[rowId].data;
//                     const { [key]: oldKeyValue, ...filteredRowData } = rowData;
//                     newContent[rowId] = {
//                       rowId,
//                       data: {
//                         ...filteredRowData,
//                       },
//                     };
//                     newContent[rowId].data[newKey] = rowData[key];
//                   });
//                   setNewValue(newContent, [
//                     taskId,
//                     "subtasks",
//                     subtaskId,
//                     "title",
//                   ]);
//                 }
//                 setFocused(-1);
//               }}
//             />
//           </div>
//         </th>
//       ))}
//     </tr>
//   );

//   const tableInner =
//     tableValues.length &&
//     tableValues.map(({ data, rowId }, rowIdx) => (
//       <tr key={`tr-${rowId}`}>
//         {Object.entries(data).map(([key, cell], cellIdx) => (
//           <td
//             key={`td-${rowId}-${key}`}
//             onMouseEnter={() => setHoveredCell([rowIdx, cellIdx])}
//           >
//             <div>
//               {cellIdx == 0 && (
//                 <HiddenButtons
//                   isHidden={rowIdx != hoveredCell[0]}
//                   position="left"
//                 >
//                   <>
//                     {/* <HiddenButton onClick={() => {}}>
//                       <IconExpand accessibilityLabel="drag" />
//                     </HiddenButton> */}
//                     <HiddenButton
//                       onClick={() => {
//                         if (tableRowIds.length == 1) {
//                           setNewValue(null, [taskId, "subtasks", subtaskId]);
//                         } else {
//                           const { [rowId]: removedContent, ...newContent } =
//                             content;
//                           setNewValue(newContent, [
//                             taskId,
//                             "subtasks",
//                             subtaskId,
//                             "title",
//                           ]);
//                         }
//                       }}
//                     >
//                       <IconClose accessibilityLabel="drag" />
//                     </HiddenButton>
//                   </>
//                 </HiddenButtons>
//               )}
//               <div className={cx(styles.input_wrap)}>
//                 <input
//                   className={cx(
//                     cellIdx == 0 &&
//                       rowIdx == tableValues.length - 1 && {
//                         borderBottomLeftRadius: 4,
//                       },
//                     cellIdx == Object.keys(data).length - 1 &&
//                       rowIdx == tableValues.length - 1 && {
//                         borderBottomRightRadius: 4,
//                       }
//                   )}
//                   value={cell}
//                   onChange={({ target: { value } }) => {
//                     setNewValue(value, [
//                       taskId,
//                       "subtasks",
//                       subtaskId,
//                       "title",
//                       rowId,
//                       "data",
//                       key,
//                     ]);
//                   }}
//                 />
//               </div>
//             </div>
//           </td>
//         ))}
//       </tr>
//     ));

//   return (
//     <SubItemCard micro>
//       <>
//         <Spacing top={2} bottom={2} horizontal={2}>
//           <table
//             width="100%"
//             className={cx(styles.table)}
//             onMouseLeave={() => {
//               setHoveredCell([-1, -1]);
//             }}
//           >
//             <thead>{tableHeader}</thead>
//             <tbody>{tableInner}</tbody>
//           </table>
//         </Spacing>
//         <Spacing all={2}>
//           <Button
//             small
//             inverted
//             onClick={() => {
//               const newRowId = largestRowId + 1;
//               const newRow: TableDataRow = {
//                 data: {},
//                 rowId: newRowId,
//               };
//               tableCols.forEach((key) => {
//                 newRow.data[key] = "";
//               });

//               setNewValue(newRow, [
//                 taskId,
//                 "subtasks",
//                 subtaskId,
//                 "title",
//                 newRowId,
//               ]);
//             }}
//           >
//             Add row
//           </Button>
//           <Spacing inline left={1}>
//             <Button
//               small
//               inverted
//               onClick={() => {
//                 if (newCol in tableCols) {
//                   console.log("Key already exists");
//                 } else {
//                   const newContent = { ...content };

//                   tableRowIds.forEach((rowId) => {
//                     newContent[rowId] = {
//                       rowId,
//                       data: {
//                         ...newContent[rowId].data,
//                         [newCol]: "",
//                       },
//                     };
//                   });

//                   setNewValue(newContent, [
//                     taskId,
//                     "subtasks",
//                     subtaskId,
//                     "title",
//                   ]);
//                 }
//                 setNewCol("");
//               }}
//             >
//               Add column
//             </Button>
//             <Spacing inline left={1}>
//               <Input
//                 small
//                 label="New col"
//                 hideLabel
//                 value={newCol}
//                 onChange={setNewCol}
//               />
//             </Spacing>
//           </Spacing>
//         </Spacing>
//       </>
//     </SubItemCard>
//   );
// }

// // Reorder rows/cols
// // When you leave the table, remove all hidden buttons
