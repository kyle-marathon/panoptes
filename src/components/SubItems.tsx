import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
import { useState } from "react";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import { set, update, ref, remove } from "firebase/database";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  Draggable,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

import { db, hasItemsPath } from "../setup/setupFirebase";

import IconButton from "@airbnb/lunar/lib/components/IconButton";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconCheck from "@airbnb/lunar-icons/lib/interface/IconCheck";
import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
import IconUndo from "@airbnb/lunar-icons/lib/interface/IconUndo";
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

type SubItemProps = {
  numSubtasks: number;
  isDragging: boolean;
  item: Item;
  setNewValue: (newValue: any, field: string | (string | number)[]) => void;
  deleteSubtask: (id: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
};

export default function SubItems({
  numSubtasks,
  isDragging,
  item,
  setNewValue,
  deleteSubtask,
  dragHandleProps,
}: SubItemProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [pkd, setPkd] = useRecoilState(pkdState);
  const uid = useRecoilValue(uidState);

  const { id, completed, subtasks, required, times, frequency } = item;
  const subtaskValues = subtasks ? Object.values(subtasks) : [];

  if (numSubtasks <= 0) {
    return <div></div>;
  }

  const frequencyBlock = frequency && (
    <Frequency
      completed={completed}
      isDragging={isDragging}
      frequency={frequency}
      setNewValue={setNewValue}
    />
  );

  const timesBlock = times && (
    <Times
      isDragging={isDragging}
      times={times}
      completed={completed}
      setNewValue={setNewValue}
    />
  );

  const requiredBlock =
    subtasks && numSubtasks && required ? (
      <Required
        subtasks={subtasks}
        isDragging={isDragging}
        required={required}
        numSubtasks={numSubtasks}
        setNewValue={setNewValue}
      />
    ) : (
      <></>
    );

  console.log(item.title, frequencyBlock);

  const subtaskBlocks = subtaskValues.reverse().map((subtask, index) => {
    const { title, collapsed, hideToolbar } = subtask;
    return (
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

                    if (!!item.required && !!subtasks) {
                      const numComplete =
                        Object.values(subtasks).reduce(
                          (acc, subtask) => (subtask.completed ? acc + 1 : acc),
                          0
                        ) - 1;

                      if (numComplete < item.required) {
                        const newPkd = pkd - 10;
                        setPkd(newPkd);
                        set(ref(db, `${uid}/${PKD_KEY}`), newPkd);
                        setNewValue(0, [id, "completed"]);
                      }
                    }

                    setNewValue(0, [id, "subtasks", subtask.id, "completed"]);
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

                    if (!!item.required && !!subtasks) {
                      const numComplete =
                        Object.values(subtasks).reduce(
                          (acc, subtask) => (subtask.completed ? acc + 1 : acc),
                          0
                        ) + 1;

                      console.log(numComplete);
                      if (numComplete >= item.required) {
                        const newPkd = pkd + 10;
                        setPkd(newPkd);
                        set(ref(db, `${uid}/${PKD_KEY}`), newPkd);
                        setNewValue(1, [id, "completed"]);
                      }
                    }

                    setNewValue(1, [id, "subtasks", subtask.id, "completed"]);
                  }}
                >
                  <IconCheck decorative />
                </IconButton>
              )}
            </>
          }
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
              <div {...dragHandleProps}>
                <HiddenButton onClick={() => {}}>
                  <IconExpand accessibilityLabel="drag" />
                </HiddenButton>
              </div>
            }
          />
        </Row>
      </SubItemCard>
    );
  });

  return (
    <>
      {subtaskBlocks}
      {frequencyBlock}
      {timesBlock}
      {requiredBlock}
    </>
  );
}
