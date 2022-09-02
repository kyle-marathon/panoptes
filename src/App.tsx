import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useState } from "react";

import Input from "@airbnb/lunar/lib/components/Input";
import Row from "@airbnb/lunar/lib/components/Row";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import Switch from "@airbnb/lunar/lib/components/Switch";
import DatePickerInput from "@airbnb/lunar/lib/components/DatePickerInput";

import { MOCK_ITEMS, MOCK_CONFIG } from "./assets/mockData";
import { MemoizedTask } from "./components/Task";
import Test from "./Test";
import { keyCodes } from "./assets/constants";
import { Items } from "./assets/types";

import "./setup/setTheme";
import { isItemLive } from "./assets/utils";

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

  // testafter: {
  //   position: "relative",

  //   ":after": {
  //     content: '" wow "',
  //     position: "absolute",
  //     top: "100%",
  //     left: 0,
  //     right: 0,
  //     height: unit / 2,
  //     background: `linear-gradient(${toRGBA(
  //       color.core.neutral[6],
  //       15
  //     )}, ${toRGBA(color.core.neutral[6], 0)})`,
  //   },
  // },
});

export default function App() {
  const [items, setItems] = useState<Items>(MOCK_ITEMS);
  const [startDate, setStartDate] = useState<Date>(MOCK_CONFIG.startDate);
  const [endDate, setEndDate] = useState<Date>(MOCK_CONFIG.endDate);
  const [newItem, setNewItem] = useState("");
  const [styles, cx] = useStyles(appStyleSheet);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // return <div className={cx(styles.testafter)}>hello world</div>;
  // return <Test />;

  const handleKeyDown = ({ keyCode }: any) => {
    if (keyCode == keyCodes.ENTER) {
      setItems([
        {
          title: newItem,
          id: `dnd-${items.length}`,
          completed: 0,
        },
        ...items,
      ]);
      setNewItem("");
    }
  };

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

    const newItems = Array.from(items);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, items[source.index]);
    setItems(newItems);
  };

  let filteredItems = showCompleted ? items : [];
  if (!showCompleted) {
    filteredItems = items
      .filter((item) => isItemLive(item))
      .map((item) => ({
        ...item,
        subtasks: item.subtasks
          ? item.subtasks.filter((subtask) => !subtask.completed)
          : [],
      }));
  }

  console.log(startDate);

  return (
    <Spacing inner all={3}>
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
                {filteredItems.map((item, index) => (
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

// Put everything in local storage or firebase
// localStorage.setItem('KEY_NAME', JSON.stringify(obj))
// JSON.parse(localStorage.getItem('KEY_NAME'))

// What happens at the end of a sprint?
// Review and catalogue results
// Option to carry over tasks
// - Or even mark tasks as always getting carried over?
// Set start date to previous end date
// Pick new end date
// - Default is based on previous interval
