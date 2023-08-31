export default function App() {
  return <div>app</div>;
}

// import { useEffect, useState } from "react";
// import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
// import ReactQuill from "react-quill";

// import { ref, set, update, onValue } from "firebase/database";
// import "firebaseui/dist/firebaseui.css";
// import { db, lastIdPath, hasItemsPath } from "./setup/setupFirebase";

// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import useTheme from "@airbnb/lunar/lib/hooks/useTheme";

// import { useRecoilValue, useRecoilState } from "recoil";

// import MenuToggle, {
//   Item as MenuItem,
// } from "@airbnb/lunar/lib/components/MenuToggle";
// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import Shimmer from "@airbnb/lunar/lib/components/Shimmer";

// import { MemoizedTask } from "./components/Task";
// // import Input from "@airbnb/lunar/lib/components/Input";
// import Card from "./components/Card";
// import Input from "./components/Input";
// import Row from "./components/Row";
// import Editor from "./components/Editor";

// import { keyCodes } from "./utils/constants";
// import { Items, Types } from "./utils/types";

// import "./setup/setTheme";
// import "./setup/setupFirebase";
// import { isItemLive, getBodyWidth, getCardInnerWidth } from "./utils/utils";
// import {
//   uidState,
//   lastIdState,
//   showPacksState,
//   hasItemsState,
//   itemsState,
// } from "./atoms";
// import SubItemCard from "./components/SubItems/SubItemCard";

// export const appStyleSheet: StyleSheet = () => ({
//   tasks: {
//     display: "flex",
//     flexDirection: "column",
//     "@selectors": {
//       "> div:last-child": {
//         flex: "1 1 1px",
//         overflowY: "auto",
//         overflowX: "hidden",
//         "@selectors": {
//           "::-webkit-scrollbar": {
//             display: "none",
//           },
//         },
//       },
//     },
//   },
// });

// export default function App({ loading }: { loading: boolean }) {
//   const [styles, cx] = useStyles(appStyleSheet);

//   const [items, setItems] = useRecoilState<Items>(itemsState);
//   const [hasItems, setHasItems] = useRecoilState(hasItemsState);
//   const [showPacks, setShowPacks] = useRecoilState(showPacksState);
//   const lastId = useRecoilValue(lastIdState);
//   const uid = useRecoilValue(uidState);

//   const [newItem, setNewItem] = useState("");
//   const [showDetails, setShowDetails] = useState<boolean>(true);
//   const [showCompleted, setShowCompleted] = useState<boolean>(true);
//   const [itemType, setItemType] = useState<string>(Types.Task);

//   const handleKeyDown = (e: KeyboardEvent) => {
//     const { key } = e;
//     if (key == "Enter") {
//       const newLastId = lastId + 1;
//       const path = `${uid}/tasks/task-${newLastId}`;
//       const newId = `task-${newLastId}`;
//       const smallestIndex = Object.values(items).reduce(
//         (acc, item) => (item.index < acc ? item.index : acc),
//         0
//       );

//       const newTask = {
//         // Remove exceess new line created by enter key
//         title: `<b>${newItem.slice(0, -11)}</b>`,
//         id: newId,
//         completed: 0,
//         subtasks: {},
//         index: smallestIndex - 1,
//         type: itemType,
//         hideToolbar: true,
//         collapsed: false,
//       };

//       set(ref(db, path), newTask);
//       // set(ref(db, `${uid}/${hasItemsPath}`), true);
//       set(ref(db, `${uid}/${lastIdPath}`), newLastId);

//       setItems({ [newId]: newTask, ...items });
//       setNewItem("");
//     }
//   };

//   const itemsArr = Object.values(items);
//   const filteredItems = showCompleted
//     ? itemsArr
//     : itemsArr
//         .filter((item) => isItemLive(item))
//         .map((item) => ({
//           ...item,
//           subtasks: item.subtasks
//             ? Object.values(item.subtasks).filter(
//                 (subtask) => !subtask.completed
//               )
//             : {},
//         }));
//   const sortedItems = filteredItems.sort((a, b) =>
//     a.index > b.index ? 1 : -1
//   );

//   const dummyItems =
//     loading &&
//     new Array(4).fill("").map((x, idx) => (
//       <div
//         key={idx}
//         className={cx({
//           opacity: 0.7 - idx / 5,
//         })}
//       >
//         <Row compact middleAlign>
//           <Spacing inner top={3}>
//             <Card noShadow={true} overflow>
//               <Spacing inner horizontal={2} vertical={1}>
//                 <Row middleAlign>
//                   <Shimmer height={10} width="100%" />
//                 </Row>
//               </Spacing>
//             </Card>
//           </Spacing>
//         </Row>
//       </div>
//     ));

//   const onDragEnd = (result: DropResult) => {
//     const { destination, source } = result;

//     if (!destination) {
//       return;
//     }

//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index == source.index
//     ) {
//       return;
//     }

//     const sourceId = sortedItems[source.index].id;
//     sortedItems.splice(source.index, 1);
//     sortedItems.splice(destination.index, 0, items[sourceId]);
//     const newItems: Items = {};
//     const updates: { [key: string]: number } = {};
//     sortedItems.forEach((item, index) => {
//       newItems[item.id] = {
//         ...item,
//         index,
//       };
//       updates[`${uid}/tasks/${item.id}/index`] = index;
//     });

//     update(ref(db), updates);

//     setItems({ ...newItems });
//   };

//   const typeMenuItems: JSX.Element[] = [];
//   Object.values(Types).forEach((value) => {
//     if (typeof value == "string") {
//       typeMenuItems.push(
//         <MenuItem
//           key={value}
//           onClick={() => {
//             setItemType(value);
//           }}
//         >
//           {value}
//         </MenuItem>
//       );
//     }
//   });

//   return (
//     <div className={cx(styles.tasks)}>
//       <SubItemCard small={false}>
//         <Editor
//           hideToolbar
//           content={newItem}
//           onChange={setNewItem}
//           onKeyDown={handleKeyDown}
//         />
//       </SubItemCard>
//       {dummyItems}
//       <DragDropContext onDragEnd={(results: DropResult) => onDragEnd(results)}>
//         <Droppable droppableId={"droppable-1"}>
//           {(provided) => (
//             <div ref={provided.innerRef} {...provided.droppableProps}>
//               {sortedItems.map((item, index) => (
//                 <MemoizedTask
//                   key={item.id}
//                   showDetails={showDetails}
//                   index={index}
//                   setItems={setItems}
//                   item={item}
//                 />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// }
