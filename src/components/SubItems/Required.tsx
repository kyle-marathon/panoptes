import SubItemCard from "./SubItemCard";

import Row from "../Row";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconButton from "@airbnb/lunar/lib/components/IconButton";
import IconRemove from "@airbnb/lunar-icons/lib/interface/IconRemove";
import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";

import { Subtask } from "../../assets/types";

type RequiredProps = {
  subtasks: Subtask[];
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
  console.log(subtasks);
  const countCompleted = subtasks.reduce(
    (acc, subtask) => (acc += subtask.completed),
    0
  );
  console.log(countCompleted);

  return (
    <SubItemCard isDragging={isDragging}>
      <Row
        before={
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
