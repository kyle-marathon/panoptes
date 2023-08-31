import LunarInput, {
  InputProps as LunarInputProps,
} from "@airbnb/lunar/lib/components/Input";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

export const inputStyleSheet: StyleSheet = ({ unit }) => ({
  input_wrap: {
    "@selectors": {
      "> section > div > div > div > input": {
        borderWidth: 1,
      },
      "> section > div > label": {
        marginBottom: unit / 2,
      },
    },
  },
});

export default function Input(props: LunarInputProps) {
  const [styles, cx] = useStyles(inputStyleSheet);

  return (
    <div className={cx(styles.input_wrap)}>
      <LunarInput {...props} />
    </div>
  );
}
