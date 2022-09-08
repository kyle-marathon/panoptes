import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { ref, set, update, onValue } from "firebase/database";
import "firebaseui/dist/firebaseui.css";
import { auth } from "./setup/setupFirebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRecoilValue, useRecoilState } from "recoil";

import { db, lastIdPath, hasItemsPath } from "./setup/setupFirebase";

import Input from "@airbnb/lunar/lib/components/Input";
import Button from "@airbnb/lunar/lib/components/Button";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import Switch from "@airbnb/lunar/lib/components/Switch";
import Shimmer from "@airbnb/lunar/lib/components/Shimmer";
import DatePickerInput from "@airbnb/lunar/lib/components/DatePickerInput";
import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

import { MemoizedTask } from "./components/Task";
import Team from "./components/Team";
import Card from "./components/Card";
import Row from "./components/Row";

import { MOCK_CONFIG } from "./utils/mockData";
import { keyCodes } from "./utils/constants";
import { Items } from "./utils/types";

import "./setup/setTheme";
import "./setup/setupFirebase";
import { isItemLive } from "./utils/utils";
import { uidState, lastIdState, showPacksState } from "./atoms";
import { UID_KEY } from "./utils/constants";

export const appStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  body: {
    maxWidth: unit * 62,
    minWidth: Math.min(window.innerWidth - unit * 8, unit * 62),
  },
  switchWrap: {
    maxWidth: "100%",
  },
  center: {
    display: "flex",
    justifyContent: "center",
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
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  const [user, loading, error] = useAuthState(auth);

  const [uid, setUid] = useRecoilState(uidState);
  const lastId = useRecoilValue(lastIdState);
  const [showPacks, setShowPacks] = useRecoilState(showPacksState);
  const [hasItems, setHasItems] = useState(true);

  const { unit } = useTheme();
  const [styles, cx] = useStyles(appStyleSheet);

  useEffect(() => {
    if (user) {
      const hasItemsRef = ref(db, `${user.uid}/${hasItemsPath}`);
      onValue(hasItemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHasItems(data);
        }
      });
    }
  }, [user]);

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
      set(ref(db, `${uid}/${hasItemsPath}`), true);
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

  const dummyItems =
    itemsArr.length == 0 &&
    hasItems &&
    new Array(5).fill("").map((x, idx) => (
      <Row
        key={idx}
        compact
        middleAlign
        before={
          <div>
            <IconExpand accessibilityLabel="drag" />
          </div>
        }
      >
        <Spacing inner vertical={0.5}>
          <Card noShadow={true} overflow>
            <Spacing inner horizontal={2} vertical={1}>
              <Row middleAlign>
                <div
                  className={cx({
                    opacity: 0.5 - idx / 10,
                  })}
                >
                  <Shimmer
                    height={10}
                    width={Math.min(window.innerWidth - unit * 15, unit * 54)}
                  />
                </div>
              </Row>
            </Spacing>
          </Card>
        </Spacing>
      </Row>
    ));

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

    update(ref(db), updates);

    setItems({ ...newItems });
  };

  return (
    <div className={cx(styles.center)}>
      <Spacing inner inline all={3}>
        <Spacing bottom={1.5}>
          <Button
            small
            inverted
            onClick={() => {
              signOut(auth);
              setUid("");
              window.localStorage.setItem(UID_KEY, "");
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
          <Team />
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
                    checked={!showDetails}
                    label="Hide details"
                    onChange={() => setShowDetails(!showDetails)}
                  />
                }
              >
                <Spacing inline right={2}>
                  <Switch
                    small
                    checked={!showCompleted}
                    label="Hide completed"
                    onChange={() => setShowCompleted(!showCompleted)}
                  />
                </Spacing>
                <Spacing inline>
                  <Switch
                    small
                    checked={showPacks}
                    label="Show packs"
                    onChange={() => {
                      setShowPacks((showPacks) => !showPacks);
                    }}
                  />
                </Spacing>
              </Row>
            </Spacing>
          </div>
          {dummyItems}
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
    </div>
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

// Later
// Later, introduce battle system
// Instead of slot machine directly, points get you access to battles
// By winning battles you get to unlock more stuff
// Pokemon, moves for the pokemon, new pokemon "packs"

// Later, you can battle friends online at the end of each arc

// Not MVP
// Use hue rotate to custom create "shinys" in browser
// Hue-rotate(180) + invert = dark pokemon
// When a new subtask is created set focus to the new subtask input field
