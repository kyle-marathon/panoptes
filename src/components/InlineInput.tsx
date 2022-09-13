import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

import Spacing from "@airbnb/lunar/lib/components/Spacing";

import { Item } from "../utils/types";
import { isItemLive } from "../utils/utils";

export const taskStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  input: {
    display: "inline-block",
    width: "100%",
    border: "none",
    textOverflow: "ellipsis",
    padding: 0,
    ":focus": {
      border: "none",
      outline: "none",
    },
  },

  input_bold: {
    fontWeight: "bold",
  },

  input_completed: {
    textDecoration: "line-through",
  },
});

type InlineInputProps = {
  item: Item;
  value: string;
  callback: (value: string, props: any) => void;
  callbackOnSubmit: (value: string, props: any) => void;
  callbackProps: any;
  isSubtask?: boolean;
  completed?: number;
  callbackOnSubmitProps?: any;
  bold?: boolean;
};

export default function InlineInput({
  isSubtask,
  item,
  completed,
  value,
  callback,
  callbackOnSubmit,
  callbackProps,
  callbackOnSubmitProps,
  bold,
}: InlineInputProps) {
  const [styles, cx] = useStyles(taskStyleSheet);

  return (
    <>
      <Spacing right={1}>
        <input
          autoFocus={isSubtask}
          className={cx(
            styles.input,
            bold && styles.input_bold,
            ((!isSubtask && !isItemLive(item)) || (isSubtask && !!completed)) &&
              styles.input_completed
          )}
          type="text"
          value={value}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) =>
            callback(value, callbackProps)
          }
          onBlur={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) =>
            callbackOnSubmit(value, callbackOnSubmitProps)
          }
        />
      </Spacing>
    </>
  );
}
