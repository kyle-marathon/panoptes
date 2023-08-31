import SubItemCard from "./SubItemCard";

import Row from "../Row";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import IconButton from "@airbnb/lunar/lib/components/IconButton";
import IconRemove from "@airbnb/lunar-icons/lib/interface/IconRemove";
import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";

type TimesProps = {
  isDragging: boolean;
  completed: number;
  times: number;
  setNewValue: (value: number, field: string) => void;
};

export default function Times({
  completed,
  isDragging,
  times,
  setNewValue,
}: TimesProps) {
  const beforeContent = (
    <>
      <Spacing inner inline right={0.5}>
        <IconButton
          disabled={times <= 2 || times <= completed}
          onClick={() => {
            setNewValue(times - 1, "times");
          }}
        >
          <IconRemove decorative size="0.887em" />
        </IconButton>
      </Spacing>
      <IconButton onClick={() => setNewValue(times + 1, "times")}>
        <IconAdd decorative size="0.887em" />
      </IconButton>
    </>
  );

  return (
    <SubItemCard italic isDragging={isDragging}>
      <Row after={beforeContent}>
        Completed {completed} out of {times} times.
      </Row>
    </SubItemCard>
  );
}
