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

import MenuToggle, {
  Item as MenuItem,
} from "@airbnb/lunar/lib/components/MenuToggle";
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

import { MOCK_CONFIG, MOCK_ITEMS } from "./utils/mockData";
import { keyCodes } from "./utils/constants";
import { Items, Types } from "./utils/types";

import "./setup/setTheme";
import "./setup/setupFirebase";
import { isItemLive, getBodyWidth, getCardInnerWidth } from "./utils/utils";
import { uidState, lastIdState, showPacksState, isOnlineState } from "./atoms";
import { UID_KEY } from "./utils/constants";

export const appStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  body: {
    width: getBodyWidth(unit),
    marginBottom: unit * 10,
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
  input_wrap: {
    fontWeight: "bold",
    "@selectors": {
      "> section  > div > div > div > input": {
        fontSize: 15,
        padding: "8px 12px 8px 12px",
        borderWidth: 1,
      },
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
  const isOnline = useRecoilValue(isOnlineState);
  const [showPacks, setShowPacks] = useRecoilState(showPacksState);
  const [hasItems, setHasItems] = useState(true);
  const [itemType, setItemType] = useState<string>(Types.Task);

  const { unit } = useTheme();
  const [styles, cx] = useStyles(appStyleSheet);

  useEffect(() => {
    if (user) {
      const hasItemsRef = ref(db, `${user.uid}/${hasItemsPath}`);
      onValue(hasItemsRef, (snapshot) => {
        const data = snapshot.val();
        setHasItems(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isOnline) {
      setItems(MOCK_ITEMS.FhIIpYHfumVyad0TJ67rSh0ZOMJ3.tasks);
    } else if (user) {
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
        title: itemType == Types.Task ? newItem : `<b>${newItem}</b>`,
        id: newId,
        completed: 0,
        subtasks: {},
        index: smallestIndex - 1,
        type: itemType,
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
      <Row key={idx} compact middleAlign>
        <Spacing inner top={2}>
          <Card noShadow={true} overflow>
            <Spacing inner horizontal={2} vertical={1}>
              <Row middleAlign>
                <div
                  className={cx({
                    opacity: 0.5 - idx / 10,
                  })}
                >
                  <Shimmer height={10} width={getCardInnerWidth(unit)} />
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

  const typeMenuItems: JSX.Element[] = [];
  Object.values(Types).forEach((value) => {
    if (typeof value == "string") {
      typeMenuItems.push(
        <MenuItem
          key={value}
          onClick={() => {
            setItemType(value);
          }}
        >
          {value}
        </MenuItem>
      );
    }
  });

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
          <Spacing top={1.5}>
            <Row
              middleAlign
              after={
                <MenuToggle
                  closeOnClick
                  inverted
                  accessibilityLabel="Actions"
                  toggleLabel={itemType}
                  zIndex={10}
                >
                  {typeMenuItems}
                </MenuToggle>
              }
            >
              <div className={cx(styles.input_wrap)}>
                <Input
                  small
                  hideLabel
                  label="New item"
                  value={newItem}
                  onChange={setNewItem}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </Row>
          </Spacing>
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
