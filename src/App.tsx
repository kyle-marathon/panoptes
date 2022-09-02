import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { ref, set, update, onValue } from "firebase/database";
import "firebaseui/dist/firebaseui.css";
import { auth } from "./setup/setupFirebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRecoilValue } from "recoil";

import { db, lastIdPath } from "./setup/setupFirebase";

import Input from "@airbnb/lunar/lib/components/Input";
import Row from "@airbnb/lunar/lib/components/Row";
import Button from "@airbnb/lunar/lib/components/Button";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import Switch from "@airbnb/lunar/lib/components/Switch";
import DatePickerInput from "@airbnb/lunar/lib/components/DatePickerInput";

import { MOCK_CONFIG } from "./assets/mockData";
import { MemoizedTask } from "./components/Task";
import { keyCodes } from "./assets/constants";
import { Items } from "./assets/types";

import "./setup/setTheme";
import "./setup/setupFirebase";
import { isItemLive } from "./assets/utils";
import { uidState, lastIdState } from "./atoms";
import { iteratorSymbol } from "immer/dist/internal";

export const appStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  body: {
    maxWidth: unit * 80,
  },
  switchWrap: {
    maxWidth: unit * 80,
  },
  testafter: {
    background: "rgb(240, 240, 255)",
    position: "relative",
    width: 300,
    height: 300,
    marginTop: 30,
    marginLeft: 30,

    ":after": {
      position: "absolute",
      left: 0,
      top: 0,
      content: "''",
      width: "100%",
      height: "100%",
      boxShadow: `rgb(48 48 48 / 100%) 0px 4px 16px !important`,
    },
  },
});

export default function App() {
  const [items, setItems] = useState<Items>({});
  const [startDate, setStartDate] = useState<Date>(MOCK_CONFIG.startDate);
  const [endDate, setEndDate] = useState<Date>(MOCK_CONFIG.endDate);
  const [newItem, setNewItem] = useState("");
  const [styles, cx] = useStyles(appStyleSheet);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [user, loading, error] = useAuthState(auth);
  const uid = useRecoilValue(uidState);
  const lastId = useRecoilValue(lastIdState);

  useEffect(() => {
    if (user) {
      const tasksRef = ref(db, `${user.uid}/tasks`);
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setItems(data);
        }
      });
    }
  }, [user]);

  const handleKeyDown = ({ keyCode }: any) => {
    if (keyCode == keyCodes.ENTER) {
      const newLastId = lastId + 1;
      const path = `${uid}/tasks/task-${newLastId}`;
      const newId = `task-${newLastId}`;
      const smallestIndex = Object.values(items).reduce(
        (acc, item) => (item.index < acc ? item.index : acc),
        0
      );
      const newTask = {
        title: newItem,
        id: newId,
        completed: 0,
        subtasks: {},
        index: smallestIndex - 1,
      };

      set(ref(db, path), newTask);

      set(ref(db, `${uid}/${lastIdPath}`), newLastId);

      setItems({ [newId]: newTask, ...items });
      setNewItem("");
    }
  };

  const itemsArr = Object.values(items);
  const filteredItems = showCompleted
    ? itemsArr
    : itemsArr
        .filter((item) => isItemLive(item))
        .map((item) => ({
          ...item,
          subtasks: item.subtasks
            ? Object.values(item.subtasks).filter(
                (subtask) => !subtask.completed
              )
            : {},
        }));
  const sortedItems = filteredItems.sort((a, b) =>
    a.index > b.index ? 1 : -1
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index == source.index
    ) {
      return;
    }

    const sourceId = sortedItems[source.index].id;
    sortedItems.splice(source.index, 1);
    sortedItems.splice(destination.index, 0, items[sourceId]);
    const newItems: Items = {};
    const updates: { [key: string]: number } = {};
    sortedItems.forEach((item, index) => {
      newItems[item.id] = {
        ...item,
        index,
      };
      updates[`${uid}/tasks/${item.id}/index`] = index;
    });

    // const updates: UpdateData = {};
    // Object.entries(newData).forEach(([key, value]) => {
    //   updates[`${dbPath}/${key}`] = value;
    // });
    // const updates = {
    //   [`${uid}/tasks/task-${newLastId}`]
    // }
    update(ref(db), updates);

    setItems({ ...newItems });
  };

  return (
    <Spacing inner all={3}>
      <Spacing bottom={1.5}>
        <Button
          small
          inverted
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </Button>
      </Spacing>
      <div className={cx(styles.body)}>
        <Row
          after={
            <DatePickerInput
              small
              hideLabel
              label="end"
              placeholder="End date"
              onChange={(newDate: string) => setEndDate(new Date(newDate))}
              value={endDate}
            />
          }
        >
          <Spacing inline right={2} bottom={1.5}>
            <DatePickerInput
              small
              hideLabel
              label="start"
              placeholder="Start date"
              onChange={(newDate: string) => setStartDate(new Date(newDate))}
              value={startDate}
            />
          </Spacing>
        </Row>
        <Input
          small
          label="New item"
          value={newItem}
          onChange={setNewItem}
          onKeyDown={handleKeyDown}
        />
        <div className={cx(styles.switchWrap)}>
          <Spacing vertical={1}>
            <Row
              before={
                <Switch
                  small
                  checked={showDetails}
                  label="Show details"
                  onChange={() => setShowDetails(!showDetails)}
                />
              }
            >
              <Spacing inline>
                <Switch
                  small
                  checked={showCompleted}
                  label="Show completed"
                  onChange={() => setShowCompleted(!showCompleted)}
                />
              </Spacing>
            </Row>
          </Spacing>
        </div>
        <DragDropContext
          onDragEnd={(results: DropResult) => onDragEnd(results)}
        >
          <Droppable droppableId={"droppable-1"}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {sortedItems.map((item, index) => (
                  <MemoizedTask
                    key={item.id}
                    showDetails={showDetails}
                    index={index}
                    setItems={setItems}
                    item={item}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Spacing>
  );
}

// Not MVP
// Substacks can be reordered
// Little graphs showing progress
// Graphic showing progress in sprint
// - Show progress relativel to progress in sprint
// Sprints have cool names? Could auto increment, or be pokemon or something
// Don't renew tasks past sprint end date
// Create new item input should be separate component
// What happens at the end of a sprint?
// - Review and catalogue results
// - Opion to carry over tasks
// - - Or even mark tasks as always getting carried over?
// - Set start date to previous end date
// - Pick new end date
// - Default is based on previous interval

// Completed
// Add advanced controls to data schema [DONE]
// Add advanced controls to dropdown menu [DONE]
// Remove logs [DONE]
// Remove crazy handleChange/Submit pattern [DONE]
// Improve code
// - Subcards could be a single component [DONE]
// - All task setItems could be one function [DONE]
// - Clean up Any [DONE]
// Subtasks can be edited [DONE]
// Able to add subtasks [DONE]

// Able to view completed tasks/subtasks [DONE]
// Able to complete subtasks [DONE]
// - UI for completing them [DONE]
// - Required subtask item updates with progress [DONE]

// Can complete/uncomplete repeat and frequency tasks [DONE]
// Frequency tasks keep history of last completed [DONE]
// and can undo [DONE]

// For times/frequency/required tasks, task completes once you fulfil goals
// times[DONE]
// frequency[DONE]
// required [DONE]
// Set sprint end date [DONE]

// Put everything in local storage or firebase [DONE]
