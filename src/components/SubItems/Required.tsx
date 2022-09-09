import SubItemCard from "./SubItemCard";

import Row from "../Row";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconButton from "@airbnb/lunar/lib/components/IconButton";
import IconRemove from "@airbnb/lunar-icons/lib/interface/IconRemove";
import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";

import { Subtasks } from "../../utils/types";

type RequiredProps = {
  subtasks: Subtasks;
  isDragging: boolean;
  required: number;
  numSubtasks: number;
  setNewValue: (value: number, field: string) => void;
};

export default function Required({
  subtasks,
  isDragging,
  required,
  numSubtasks,
  setNewValue,
}: RequiredProps) {
  const countCompleted = Object.values(subtasks).reduce(
    (acc, subtask) => (acc += subtask.completed),
    0
  );

  return (
    <SubItemCard isDragging={isDragging}>
      <Row
        after={
          <>
            <Spacing inner inline right={1}>
              <IconButton
                disabled={required == 1}
                onClick={() => {
                  setNewValue(required - 1, "required");
                }}
              >
                <IconRemove decorative />
              </IconButton>
            </Spacing>
            <IconButton
              disabled={required >= numSubtasks - 1}
              onClick={() => {
                setNewValue(required + 1, "required");
              }}
            >
              <IconAdd decorative />
            </IconButton>
          </>
        }
      >
        Complete {required} out of {numSubtasks} subtasks [{countCompleted}/
        {required}]
      </Row>
    </SubItemCard>
  );
}
