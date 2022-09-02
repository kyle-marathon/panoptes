import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import produce from "immer";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import IconButton from "@airbnb/lunar/lib/components/IconButton";
import MenuToggle, {
  Item as MenuItem,
} from "@airbnb/lunar/lib/components/MenuToggle";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconCheck from "@airbnb/lunar-icons/lib/interface/IconCheck";
import IconCheckAlt from "@airbnb/lunar-icons/lib/interface/IconCheckAlt";
import IconUndo from "@airbnb/lunar-icons/lib/interface/IconUndo";
import IconMenuDotsVert from "@airbnb/lunar-icons/lib/interface/IconMenuDotsVert";
import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

import Card from "./Card";
import Row from "./Row";
import Frequency from "./SubItems/Frequency";
import Required from "./SubItems/Required";
import Times from "./SubItems/Times";
import SubItemCard from "./SubItems/SubItemCard";
import InlineInput from "./InlineInput";

import { Item, Items } from "../assets/types";
import { fieldDefaults } from "../assets/constants";
import { formatedDate, isItemExhausted, isItemLive } from "../assets/utils";

type TaskProps = {
  showDetails: boolean;
  index: number;
  setItems: Dispatch<SetStateAction<Items>>;
  item: Item;
};

export const taskStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
});

function Task({ showDetails, index, setItems, item }: TaskProps) {
  const [styles, cx] = useStyles(taskStyleSheet);

  const { title, id, completed, subtasks, required, times, frequency } = item;

  const setNewValue = (
    newValue: number | string | any[],
    field: string | (string | number)[]
  ) => {
    if (typeof field == "object") {
      setItems((items) =>
        produce(items, (draftState) => {
          let tempObj = draftState[index];
          field.slice(0, -1).forEach((subField) => {
            // @ts-ignore
            tempObj = tempObj[subField];
          });
          // @ts-ignore
          tempObj[field[field.length - 1]] = newValue;
        })
      );
    } else if (typeof field == "string") {
      setItems((items) => {
        const newItems = [...items];
        newItems.splice(index, 1, {
          ...items[index],
          [field]: newValue,
        });
        return newItems;
      });
    }
  };

  const handleAddField = (type: string) => {
    setNewValue(fieldDefaults[type], type);
  };

  const handleComplete = () => {
    setItems((items) => {
      const newItems = [...items];
      const thisItem = items[index];
      newItems.splice(index, 1, {
        ...thisItem,
        completed: thisItem.completed ? thisItem.completed + 1 : 1,
        lastCompleted: item.lastCompleted
          ? [...item.lastCompleted, new Date()]
          : [new Date()],
      });
      return newItems;
    });
  };

  const handleUncomplete = () => {
    setItems((items) => {
      const newItems = [...items];
      const thisItem = items[index];
      newItems.splice(index, 1, {
        ...thisItem,
        completed: thisItem.completed ? thisItem.completed - 1 : 0,
        lastCompleted:
          item.lastCompleted && item.lastCompleted.length > 0
            ? [...item.lastCompleted.slice(0, -1)]
            : [],
      });
      return newItems;
    });
  };

  const handleDelete = () => {
    setItems((items) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const menuOptions = [
    <MenuItem
      key="0"
      onClick={() => {
        if (subtasks != undefined) {
          const arr = subtasks[subtasks.length - 1].id.split("-");
          const newAppendix = parseInt(arr[arr.length - 1]) + 1;
          const newId = arr.join("-") + `-${newAppendix}`;
          setNewValue(
            [...subtasks, { title: "", id: newId, completed: 0 }],
            "subtasks"
          );
        } else {
          setNewValue([{ title: "", id: `${id}-0`, completed: 0 }], "subtasks");
        }
      }}
    >
      Add Subtask
    </MenuItem>,
    <MenuItem key="1" onClick={() => handleAddField("frequency")}>
      Add Frequency
    </MenuItem>,
    <MenuItem key="2" onClick={() => handleAddField("times")}>
      Add Repetitions
    </MenuItem>,
    <MenuItem key="3" onClick={handleDelete}>
      Delete
    </MenuItem>,
  ];

  if (subtasks && subtasks.length > 1) {
    menuOptions.push(
      <MenuItem key="4" onClick={() => handleAddField("required")}>
        Add Subtask Completions
      </MenuItem>
    );
  }

  const subItems = (isDragging: boolean) => (
    <>
      {subtasks &&
        subtasks.length > 0 &&
        subtasks.map((subtask, index) => (
          <SubItemCard key={subtask.id} isDragging={isDragging}>
            <Row
              after={
                subtask.completed ? (
                  <IconButton
                    onClick={() =>
                      setNewValue(0, ["subtasks", index, "completed"])
                    }
                  >
                    <IconUndo decorative />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() =>
                      setNewValue(1, ["subtasks", index, "completed"])
                    }
                  >
                    <IconCheck decorative />
                  </IconButton>
                )
              }
            >
              <InlineInput
                isSubtask
                item={item}
                completed={subtask.completed}
                value={subtask.title}
                callback={setNewValue}
                callbackProps={["subtasks", index, "title"]}
              />
            </Row>
          </SubItemCard>
        ))}
      {frequency && (
        <Frequency
          completed={completed}
          isDragging={isDragging}
          frequency={frequency}
          setNewValue={setNewValue}
        />
      )}
      {times && (
        <Times
          isDragging={isDragging}
          times={times}
          completed={completed}
          setNewValue={setNewValue}
        />
      )}
      {subtasks && subtasks.length > 1 && required && (
        <Required
          subtasks={subtasks}
          isDragging={isDragging}
          required={required}
          numSubtasks={subtasks.length}
          setNewValue={setNewValue}
        />
      )}
    </>
  );

  const renews = () => {
    if (item.frequency && item.lastCompleted && item.lastCompleted.length > 0) {
      const newDate = new Date(
        item.lastCompleted[item.lastCompleted.length - 1]
      );
      newDate.setDate(newDate.getDate() + item.frequency);
      const renewText = newDate > new Date() ? "renews" : "renewed";
      return `[${renewText} ${formatedDate(newDate)}`;
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <Row
            compact
            middleAlign
            before={
              <div {...provided.dragHandleProps}>
                <IconExpand accessibilityLabel="drag" />
              </div>
            }
          >
            <Spacing inner vertical={0.5}>
              <Card noShadow={!snapshot.isDragging} overflow>
                <Spacing inner all={1}>
                  <Row
                    compact
                    before={
                      <div className={cx(styles.flex)}>
                        <MenuToggle
                          closeOnClick
                          accessibilityLabel="Actions"
                          toggleIcon={<IconMenuDotsVert decorative />}
                          toggleLabel="Actions"
                          zIndex={10}
                          dropdownProps={{
                            left: 0,
                          }}
                        >
                          {menuOptions}
                        </MenuToggle>
                      </div>
                    }
                    after={
                      <>
                        <Spacing inline right={1}>
                          {renews() ?? <></>}
                        </Spacing>
                        {item.times || item.frequency ? (
                          <>
                            <IconButton onClick={handleUncomplete}>
                              <IconUndo decorative />
                            </IconButton>
                            <IconButton onClick={handleComplete}>
                              <IconCheckAlt decorative />
                            </IconButton>
                          </>
                        ) : item.completed ? (
                          <IconButton onClick={handleUncomplete}>
                            <IconUndo decorative />
                          </IconButton>
                        ) : (
                          <IconButton onClick={handleComplete}>
                            <IconCheckAlt decorative />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <InlineInput
                      item={item}
                      completed={completed}
                      value={title}
                      callback={setNewValue}
                      callbackProps={"title"}
                    />
                  </Row>
                </Spacing>
              </Card>
            </Spacing>
          </Row>
          {showDetails && subItems(snapshot.isDragging)}
        </div>
      )}
    </Draggable>
  );
}

export const MemoizedTask = memo(Task);
