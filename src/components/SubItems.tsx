export default function SubItems() {
  return <div>settings</div>;
}

// import { useState } from "react";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import { set, update, ref, remove } from "firebase/database";
// import { useRecoilValue, useRecoilState } from "recoil";
// import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

// import { db } from "../setup/setupFirebase";

// import IconButton from "@airbnb/lunar/lib/components/IconButton";
// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import IconCheck from "@airbnb/lunar-icons/lib/interface/IconCheck";
// import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
// import IconUndo from "@airbnb/lunar-icons/lib/interface/IconUndo";
// import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

// import Frequency from "./SubItems/Frequency";
// import Required from "./SubItems/Required";
// import Times from "./SubItems/Times";
// import DataTable from "./SubItems/DataTable";
// import SubItemCard from "./SubItems/SubItemCard";
// import Editor from "./Editor";
// import { HiddenButton } from "./HiddenButtons";

// import { Item, TableData } from "../utils/types";
// import { PKD_KEY } from "../utils/constants";

// import { uidState, pkdState } from "../atoms";

// type SubItemProps = {
//   numSubtasks: number;
//   isDragging: boolean;
//   item: Item;
//   setNewValue: (newValue: any, field: string | (string | number)[]) => void;
//   deleteSubtask: (id: string) => void;
//   dragHandleProps?: DraggableProvidedDragHandleProps | null;
// };

// export const styleSheet: StyleSheet = ({ color, font, unit }) => ({
//   flex: {
//     display: "flex",
//     alignItems: "center",
//   },
// });

// export default function SubItems({
//   numSubtasks,
//   isDragging,
//   item,
//   setNewValue,
//   deleteSubtask,
//   dragHandleProps,
// }: SubItemProps) {
//   const [styles, cx] = useStyles(styleSheet);

//   const [collapsed, setCollapsed] = useState(false);
//   const [pkd, setPkd] = useRecoilState(pkdState);
//   const uid = useRecoilValue(uidState);

//   const { id, completed, subtasks, required, times, frequency } = item;
//   const subtaskValues = subtasks ? Object.values(subtasks) : [];

//   const frequencyBlock = frequency && (
//     <Frequency
//       completed={completed}
//       isDragging={isDragging}
//       frequency={frequency}
//       setNewValue={setNewValue}
//     />
//   );

//   const timesBlock = times && (
//     <Times
//       isDragging={isDragging}
//       times={times}
//       completed={completed}
//       setNewValue={setNewValue}
//     />
//   );

//   const requiredBlock =
//     subtasks && numSubtasks && required ? (
//       <Required
//         subtasks={subtasks}
//         isDragging={isDragging}
//         required={required}
//         numSubtasks={numSubtasks}
//         setNewValue={setNewValue}
//       />
//     ) : (
//       <></>
//     );

//   const dataBlock = subtaskValues
//     .filter((subtask) => subtask.type == "DataTable")
//     .map((subtask) => (
//       <DataTable
//         key={subtask.id}
//         taskId={id}
//         subtaskId={subtask.id}
//         setNewValue={setNewValue}
//         content={subtask.title as TableData}
//       />
//     ));

//   const subtaskBlocks = subtaskValues
//     .filter((subtaskValue) => subtaskValue.type != "DataTable")
//     .reverse()
//     .map((subtask, index) => {
//       const { collapsed, hideToolbar } = subtask;
//       return (
//         <SubItemCard key={subtask.id} isDragging={isDragging}>
//           <div
//             className={cx({
//               display: "flex",
//               justifyContent: "space-between",
//             })}
//           >
//             <div
//               className={cx({
//                 flexGrow: 1,
//               })}
//             >
//               <Editor
//                 isCompleted={subtask.completed > 0}
//                 content={subtask.title}
//                 collapsed={collapsed}
//                 hideToolbar={hideToolbar}
//                 onFocus={() => {
//                   setCollapsed(false);
//                 }}
//                 onBlur={() => {
//                   if (item.collapsed) {
//                     setCollapsed(true);
//                   }
//                 }}
//                 onChange={(value: string) => {
//                   set(
//                     ref(db, `${uid}/tasks/${id}/subtasks/${subtask.id}/title`),
//                     value
//                   );
//                   setNewValue(value, [id, "subtasks", subtask.id, "title"]);
//                 }}
//                 extraHiddenButtons={
//                   <div {...dragHandleProps}>
//                     <HiddenButton onClick={() => {}}>
//                       <IconExpand accessibilityLabel="drag" />
//                     </HiddenButton>
//                   </div>
//                 }
//               />
//             </div>
//             <div
//               className={cx({
//                 lineHeight: 0,
//                 display: "flex",
//                 alignItems: "flex-start",
//               })}
//             >
//               <Spacing inline right={0.5}>
//                 <IconButton onClick={() => deleteSubtask(subtask.id)}>
//                   <IconClose decorative size="0.887em" />
//                 </IconButton>
//               </Spacing>
//               {subtask.completed ? (
//                 <IconButton
//                   onClick={() => {
//                     const newPkd = pkd - 2;
//                     setPkd(newPkd);
//                     set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

//                     if (!!item.required && !!subtasks) {
//                       const numComplete =
//                         Object.values(subtasks).reduce(
//                           (acc, subtask) => (subtask.completed ? acc + 1 : acc),
//                           0
//                         ) - 1;

//                       if (numComplete < item.required) {
//                         const newPkd = pkd - 10;
//                         setPkd(newPkd);
//                         set(ref(db, `${uid}/${PKD_KEY}`), newPkd);
//                         setNewValue(0, [id, "completed"]);
//                       }
//                     }

//                     setNewValue(0, [id, "subtasks", subtask.id, "completed"]);
//                   }}
//                 >
//                   <IconUndo decorative size="0.887em" />
//                 </IconButton>
//               ) : (
//                 <IconButton
//                   onClick={() => {
//                     const newPkd = pkd + 2;
//                     setPkd(newPkd);
//                     set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

//                     if (!!item.required && !!subtasks) {
//                       const numComplete =
//                         Object.values(subtasks).reduce(
//                           (acc, subtask) => (subtask.completed ? acc + 1 : acc),
//                           0
//                         ) + 1;

//                       if (numComplete >= item.required) {
//                         const newPkd = pkd + 10;
//                         setPkd(newPkd);
//                         set(ref(db, `${uid}/${PKD_KEY}`), newPkd);
//                         setNewValue(1, [id, "completed"]);
//                       }
//                     }

//                     setNewValue(1, [id, "subtasks", subtask.id, "completed"]);
//                   }}
//                 >
//                   <IconCheck decorative size="0.887em" />
//                 </IconButton>
//               )}
//             </div>
//           </div>
//         </SubItemCard>
//       );
//     });

//   return (
//     <>
//       {subtaskBlocks}
//       {frequencyBlock}
//       {timesBlock}
//       {requiredBlock}
//       {dataBlock}
//     </>
//   );
// }
