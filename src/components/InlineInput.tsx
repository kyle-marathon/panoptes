import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

import { Item } from "../assets/types";
import { isItemLive } from "../assets/utils";

export const taskStyleSheet: StyleSheet = ({ color, font, unit }) => ({
  input: {
    display: "inline-block",
    width: "100%",
    border: "none",
    textOverflow: "ellipsis",
    ":focus": {
      border: "none",
      outline: "none",
    },
  },

  input_completed: {
    textDecoration: "line-through",
  },
});

type InlineInputProps = {
  isSubtask?: boolean;
  item: Item;
  completed?: number;
  value: string;
  callback: (value: string, props: any) => void;
  callbackOnSubmit: (value: string, props: any) => void;
  callbackProps: any;
  callbackOnSubmitProps?: any;
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
}: InlineInputProps) {
  const [styles, cx] = useStyles(taskStyleSheet);

  return (
    <input
      className={cx(
        styles.input,
        (!isItemLive(item) || (isSubtask && !!completed)) &&
          styles.input_completed
      )}
      type="text"
      value={value}
      onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
        callback(value, callbackProps)
      }
      onBlur={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
        callbackOnSubmit(value, callbackOnSubmitProps)
      }
    />
  );
}
