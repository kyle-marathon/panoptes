import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
import { useState } from "react";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import produce from "immer";
import { Dispatch, memo, SetStateAction } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { set, update, ref, remove } from "firebase/database";
import { useRecoilValue, useRecoilState } from "recoil";

import { db, hasItemsPath } from "../setup/setupFirebase";

import IconButton from "@airbnb/lunar/lib/components/IconButton";
import MenuToggle, {
  Item as MenuItem,
} from "@airbnb/lunar/lib/components/MenuToggle";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconCheck from "@airbnb/lunar-icons/lib/interface/IconCheck";
import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
import IconCheckAlt from "@airbnb/lunar-icons/lib/interface/IconCheckAlt";
import IconUndo from "@airbnb/lunar-icons/lib/interface/IconUndo";
import IconNotes from "@airbnb/lunar-icons/lib/general/IconNotes";

import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";
import IconAssignment from "@airbnb/lunar-icons/lib/general/IconAssignment";
import IconWatch from "@airbnb/lunar-icons/lib/general/IconWatch";
import IconFlower from "@airbnb/lunar-icons/lib/general/IconFlower";

import IconMenuDotsVert from "@airbnb/lunar-icons/lib/interface/IconMenuDotsVert";
import IconExpand from "@airbnb/lunar-icons/lib/interface/IconExpand";

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
  const { color } = useTheme();

  const { title, id, completed, subtasks, required, times, frequency } = item;
  const dbPath = `${uid}/tasks/${id}`;
  const numSubtasks = subtasks ? Object.keys(subtasks).length : 0;

  const setNewValue = (newValue: any, field: string | (string | number)[]) => {
    if (typeof field == "object") {
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

  type UpdateData = { [key: string]: any };

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
    // setNewValue({ [newId]: newSubtask }, "subtasks");
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

  const handleEditSubtaskTitle = (value: string, subtaskId: string) => {
    set(ref(db, `${dbPath}/subtasks/${subtaskId}/title`), value);
  };

  const handleEditTitle = (value: string) => {
    set(ref(db, `${dbPath}/title`), value);
  };

  const subtaskValues = subtasks ? Object.values(subtasks) : [];

  const subItems = (isDragging: boolean) => (
    <>
      {numSubtasks > 0 &&
        subtaskValues.reverse().map((subtask, index) => (
          <SubItemCard key={subtask.id} isDragging={isDragging}>
            <Row
              middleAlign
              after={
                <>
                  <Spacing inline right={1}>
                    <IconButton onClick={() => deleteSubtask(subtask.id)}>
                      <IconClose decorative />
                    </IconButton>
                  </Spacing>
                  {subtask.completed ? (
                    <IconButton
                      onClick={() => {
                        const newPkd = pkd - 2;
                        setPkd(newPkd);
                        set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

                        setNewValue(0, [
                          id,
                          "subtasks",
                          subtask.id,
                          "completed",
                        ]);
                      }}
                    >
                      <IconUndo decorative />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => {
                        const newPkd = pkd + 2;
                        setPkd(newPkd);
                        set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

                        setNewValue(1, [
                          id,
                          "subtasks",
                          subtask.id,
                          "completed",
                        ]);
                      }}
                    >
                      <IconCheck decorative />
                    </IconButton>
                  )}
                </>
              }
            >
              <InlineInput
                isSubtask
                item={item}
                completed={subtask.completed}
                value={subtask.title}
                callback={setNewValue}
                callbackProps={[id, "subtasks", subtask.id, "title"]}
                callbackOnSubmit={handleEditSubtaskTitle}
                callbackOnSubmitProps={subtask.id}
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
      {subtasks && numSubtasks && required ? (
        <Required
          subtasks={subtasks}
          isDragging={isDragging}
          required={required}
          numSubtasks={numSubtasks}
          setNewValue={setNewValue}
        />
      ) : (
        <></>
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
                  </>
                </HiddenButtons>
                <Spacing inner vertical={1} horizontal={1.5}>
                  <Row
                    compact
                    middleAlign
                    after={
                      <>
                        <Spacing inline right={1}>
                          {renews() ?? <></>}
                        </Spacing>
                        {item.times || item.frequency ? (
                          <>
                            <Spacing inline right={1}>
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
                    {item.type === Types.Editor ? (
                      <Editor
                        hover={hover}
                        id={id}
                        content={title}
                        initialCollapsed={item.collapsed}
                        initialHideToolbar={item.hideToolbar}
                        extraHiddenButtons={
                          <div {...provided.dragHandleProps}>
                            <HiddenButton onClick={() => {}}>
                              <IconExpand accessibilityLabel="drag" />
                            </HiddenButton>
                          </div>
                        }
                      />
                    ) : (
                      <InlineInput
                        bold
                        item={item}
                        completed={completed}
                        value={title}
                        callback={setNewValue}
                        callbackProps={"title"}
                        callbackOnSubmit={handleEditTitle}
                      />
                    )}
                  </Row>
                </Spacing>
              </div>
            </Card>
          </Spacing>
          {showDetails && subItems(snapshot.isDragging)}
        </div>
      )}
    </Draggable>
  );
}

export const MemoizedTask = memo(Task);

{
  /* <div className={cx(styles.flex)}>
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
</div> */
}
