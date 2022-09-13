import SubItemCard from "./SubItemCard";

import Row from "../Row";
import Spacing from "@airbnb/lunar/lib/components/Spacing";
import Text from "@airbnb/lunar/lib/components/Text";
import IconButton from "@airbnb/lunar/lib/components/IconButton";
import IconRemove from "@airbnb/lunar-icons/lib/interface/IconRemove";
import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";

type FrequencyProps = {
  completed: number;
  isDragging: boolean;
  frequency: number;
  setNewValue: (value: number, field: string) => void;
};

export default function Frequency({
  completed,
  isDragging,
  frequency,
  setNewValue,
}: FrequencyProps) {
  return (
    <SubItemCard italic isDragging={isDragging}>
      <Row
        after={
          <>
            <Spacing inner inline right={1}>
              <IconButton
                disabled={frequency < 2}
                onClick={() => {
                  let newDays = frequency;
                  if (frequency < 8) {
                    newDays -= 1;
                  } else {
                    newDays -= 7;
                  }
                  setNewValue(newDays, "frequency");
                }}
              >
                <IconRemove decorative />
              </IconButton>
            </Spacing>
            <IconButton
              onClick={() => {
                let newDays = frequency;
                if (frequency < 7) {
                  newDays += 1;
                } else {
                  newDays += 7;
                }
                setNewValue(newDays, "frequency");
              }}
            >
              <IconAdd decorative />
            </IconButton>
          </>
        }
      >
        <Text>
          {frequency > 7
            ? `Repeats every ${frequency / 7} weeks`
            : frequency == 7
            ? `Repeats every week`
            : frequency > 1
            ? `Repeats every ${frequency} days`
            : `Repeats every day`}{" "}
          [completed {completed} {completed == 1 ? "time" : "times"}]
        </Text>
      </Row>
    </SubItemCard>
  );
}
