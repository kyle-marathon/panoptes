import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
import { useState } from "react";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import produce from "immer";
import { Dispatch, memo, SetStateAction } from "react";
import {
  Draggable,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { set, update, ref, remove } from "firebase/database";
import { useRecoilValue, useRecoilState } from "recoil";

import { db, hasItemsPath } from "../setup/setupFirebase";

import IconButton from "@airbnb/lunar/lib/components/IconButton";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconCheck from "@airbnb/lunar-icons/lib/interface/IconCheck";
import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
import IconCheckAlt from "@airbnb/lunar-icons/lib/interface/IconCheckAlt";
import IconUndo from "@airbnb/lunar-icons/lib/interface/IconUndo";
import IconNotes from "@airbnb/lunar-icons/lib/general/IconNotes";
import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";
import IconTitle from "@airbnb/lunar-icons/lib/general/IconTitle";
import IconChevronDown from "@airbnb/lunar-icons/lib/interface/IconChevronDown";
import IconChevronUp from "@airbnb/lunar-icons/lib/interface/IconChevronUp";
import IconAssignment from "@airbnb/lunar-icons/lib/general/IconAssignment";
import IconWatch from "@airbnb/lunar-icons/lib/general/IconWatch";
import IconFlower from "@airbnb/lunar-icons/lib/general/IconFlower";
import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

import SubItems from "./SubItems";
import Card from "./Card";
import Row from "./Row";
import Frequency from "./SubItems/Frequency";
import Required from "./SubItems/Required";
import Times from "./SubItems/Times";
import SubItemCard from "./SubItems/SubItemCard";
import InlineInput from "./InlineInput";
import Editor from "./Editor";
import HiddenButtons, { HiddenButton } from "./HiddenButtons";

import { Item, Items, Subtasks, Types } from "../utils/types";
import { fieldDefaults, PKD_KEY } from "../utils/constants";
import { formatedDate } from "../utils/utils";

import { uidState, pkdState } from "../atoms";

type TaskProps = {
  showDetails: boolean;
  index: number;
  setItems: Dispatch<SetStateAction<Items>>;
  item: Item;
};

type UpdateData = { [key: string]: any };

export const taskStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
});

function Task({ showDetails, index, setItems, item }: TaskProps) {
  const [styles, cx] = useStyles(taskStyleSheet);
  const uid = useRecoilValue(uidState);
  const [pkd, setPkd] = useRecoilState(pkdState);
  const [hover, setHover] = useState(false);
  const [collapsed, setCollapsed] = useState(item.collapsed ?? false);
  const [hideToolbar, setHideToolbar] = useState(item.hideToolbar);
  const { color } = useTheme();

  const { title, id, completed, subtasks, required, times, frequency } = item;
  const dbPath = `${uid}/tasks/${id}`;
  const numSubtasks = subtasks ? Object.keys(subtasks).length : 0;

  const setNewValue = (newValue: any, field: string | (string | number)[]) => {
    if (typeof field == "object") {
      const path = `${uid}/tasks/${field.join("/")}`;
      set(ref(db, path), newValue);

      setItems((items) =>
        produce(items, (draftState) => {
          let tempObj = { ...draftState };
          field.slice(0, -1).forEach((subField) => {
            // @ts-ignore
            tempObj = tempObj[subField];
          });
          // @ts-ignore
          tempObj[field[field.length - 1]] = newValue;
        })
      );
    } else if (typeof field == "string") {
      set(ref(db, `${dbPath}/${field}`), newValue);

      setItems((items) => ({
        ...items,
        [id]: {
          ...item,
          [field]: newValue,
        },
      }));
    }
  };

  const handleAddField = (type: string) => {
    setNewValue(fieldDefaults[type], type);
  };

  const handleUpdate = (newData: UpdateData) => {
    const updates: UpdateData = {};
    Object.entries(newData).forEach(([key, value]) => {
      updates[`${dbPath}/${key}`] = value;
    });
    update(ref(db), updates);
  };

  const handleComplete = () => {
    const newPkd = pkd + 10;
    setPkd(newPkd);
    set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

    const newData = {
      completed: item.completed ? item.completed + 1 : 1,
      lastCompleted: item.lastCompleted
        ? [...item.lastCompleted, new Date()]
        : [new Date()],
    };

    handleUpdate(newData);

    setItems((items) => {
      const newItems = {
        ...items,
        [id]: {
          ...item,
          ...newData,
        },
      };
      return newItems;
    });
  };

  const handleUncomplete = () => {
    const newPkd = pkd - 10;
    setPkd(newPkd);
    set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

    const newData = {
      completed: item.completed ? item.completed - 1 : 0,
      lastCompleted:
        item.lastCompleted && item.lastCompleted.length > 0
          ? [...item.lastCompleted.slice(0, -1)]
          : [],
    };

    handleUpdate(newData);

    setItems((items) => {
      return {
        ...items,
        [id]: {
          ...item,
          ...newData,
        },
      };
    });
  };

  const handleDelete = () => {
    setItems((items) => {
      if (Object.keys(items).length == 1) {
        set(ref(db, `${uid}/${hasItemsPath}`), false);
      }
      const {
        [id]: { ...oldItem },
        ...newItems
      } = items;
      return newItems;
    });
    remove(ref(db, dbPath));
  };

  const deleteSubtask = (subtaskId: string) => {
    setItems((items) => {
      const {
        [subtaskId]: { ...oldSubtask },
        ...newSubtasks
      } = items[id].subtasks as Subtasks;
      return {
        ...items,
        [id]: {
          ...items[id],
          subtasks: newSubtasks,
        },
      };
    });
    remove(ref(db, `${dbPath}/subtasks/${subtaskId}`));
  };

  const handleAddSubtask = (isEditor: boolean) => {
    const newId =
      numSubtasks > 0
        ? `${id}-${
            Math.max(
              ...Object.keys(subtasks!).map((key) =>
                parseInt(key.split("-").slice(-1)[0])
              )
            ) + 1
          }`
        : `${id}-0`;
    const newSubtask = { title: "", id: newId, completed: 0, isEditor };

    set(ref(db, `${dbPath}/subtasks/${newId}`), newSubtask);
    setNewValue({ ...subtasks, [newId]: newSubtask }, "subtasks");
  };

  const menuOptions = [
    <HiddenButton key="0" onClick={() => handleAddSubtask(false)}>
      <IconAdd decorative />
    </HiddenButton>,
    <HiddenButton
      key="1"
      onClick={() => {
        const updates: UpdateData = {};
        if (item.type != Types.Editor) {
          updates[`${dbPath}/title`] = `<b>${item.title}</b>`;
        }
        updates[`${dbPath}/type`] =
          item.type == Types.Editor ? Types.Task : Types.Editor;
        update(ref(db), updates);
      }}
    >
      <IconNotes decorative />
    </HiddenButton>,
  ];

  if (numSubtasks) {
    menuOptions.push(
      item.required ? (
        <HiddenButton key="2" onClick={() => setNewValue(null, "required")}>
          <IconAssignment decorative color={color.core.secondary[6]} />
        </HiddenButton>
      ) : (
        <HiddenButton key="2" onClick={() => handleAddField("required")}>
          <IconAssignment decorative />
        </HiddenButton>
      )
    );
  }

  menuOptions.push(
    item.frequency ? (
      <HiddenButton key="3" onClick={() => setNewValue(null, "frequency")}>
        <IconWatch decorative color={color.core.secondary[6]} />
      </HiddenButton>
    ) : (
      <HiddenButton key="3" onClick={() => handleAddField("frequency")}>
        <IconWatch decorative />
      </HiddenButton>
    )
  );

  menuOptions.push(
    item.times ? (
      <HiddenButton key="4" onClick={() => setNewValue(null, "times")}>
        <IconFlower decorative color={color.core.secondary[6]} />
      </HiddenButton>
    ) : (
      <HiddenButton key="4" onClick={() => handleAddField("times")}>
        <IconFlower decorative />
      </HiddenButton>
    )
  );

  menuOptions.push(
    <HiddenButton key="5" onClick={handleDelete}>
      <IconClose decorative />
    </HiddenButton>
  );

  const subItems = (
    isDragging: boolean,
    dragHandleProps?: DraggableProvidedDragHandleProps
  ) => (
    <SubItems
      numSubtasks={numSubtasks}
      isDragging={isDragging}
      item={item}
      setNewValue={setNewValue}
      deleteSubtask={deleteSubtask}
      dragHandleProps={dragHandleProps}
    />
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
          <Spacing inner top={2}>
            <Card noShadow={!snapshot.isDragging} overflow>
              <div
                className={cx({ position: "relative" })}
                onMouseOver={() => {
                  setHover(true);
                }}
                onMouseOut={() => {
                  setHover(false);
                }}
              >
                <HiddenButtons isHidden={!hover}>
                  <>
                    <div {...provided.dragHandleProps}>
                      <HiddenButton onClick={() => {}}>
                        <IconExpand accessibilityLabel="drag" />
                      </HiddenButton>
                    </div>
                    {menuOptions}

                    <HiddenButton
                      onClick={() => {
                        set(
                          ref(db, `${uid}/tasks/${id}/collapsed`),
                          !collapsed
                        );

                        setCollapsed(!collapsed);
                      }}
                    >
                      {collapsed ? (
                        <IconChevronDown
                          decorative
                          color={color.core.secondary[6]}
                        />
                      ) : (
                        <IconChevronUp decorative />
                      )}
                    </HiddenButton>
                    <HiddenButton
                      onClick={() => {
                        if (!hideToolbar && collapsed) {
                          set(ref(db, `${uid}/tasks/${id}/collapsed`), false);

                          setCollapsed(false);
                        }
                        set(
                          ref(db, `${uid}/tasks/${id}/hideToolbar`),
                          !hideToolbar
                        );
                        setHideToolbar(!hideToolbar);
                      }}
                    >
                      {hideToolbar ? (
                        <IconTitle decorative color={color.core.secondary[6]} />
                      ) : (
                        <IconTitle decorative />
                      )}
                    </HiddenButton>
                  </>
                </HiddenButtons>
                <Spacing inner vertical={1} horizontal={1.5}>
                  <div
                    className={cx({
                      display: "flex",
                    })}
                  >
                    <div
                      className={cx({
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                      })}
                    >
                      <Editor
                        id={id}
                        content={title}
                        collapsed={collapsed}
                        hideToolbar={hideToolbar}
                        onFocus={() => {
                          setCollapsed(false);
                        }}
                        onBlur={() => {
                          if (item.collapsed) {
                            setCollapsed(true);
                          }
                        }}
                        extraHiddenButtons={
                          <div {...provided.dragHandleProps}>
                            <HiddenButton onClick={() => {}}>
                              <IconExpand accessibilityLabel="drag" />
                            </HiddenButton>
                          </div>
                        }
                      />
                    </div>

                    {item.type === Types.Task ? (
                      <div>
                        <Spacing inline right={1}>
                          {renews() ?? <></>}
                        </Spacing>
                        {item.times || item.frequency ? (
                          <>
                            <Spacing inner inline right={1}>
                              <IconButton
                                disabled={item.completed < 1}
                                onClick={handleUncomplete}
                              >
                                <IconUndo decorative />
                              </IconButton>
                            </Spacing>

                            <IconButton onClick={handleComplete}>
                              <IconCheckAlt decorative />
                            </IconButton>
                          </>
                        ) : item.completed ? (
                          <IconButton
                            disabled={!!item.required}
                            onClick={handleUncomplete}
                          >
                            <IconUndo decorative />
                          </IconButton>
                        ) : (
                          <IconButton
                            disabled={!!item.required}
                            onClick={handleComplete}
                          >
                            <IconCheckAlt decorative />
                          </IconButton>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </Spacing>
              </div>
            </Card>
          </Spacing>
          {showDetails &&
            subItems(snapshot.isDragging, provided.dragHandleProps)}
        </div>
      )}
    </Draggable>
  );
}

export const MemoizedTask = memo(Task);
