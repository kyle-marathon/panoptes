import LunarAutocomplete, {
  AutocompleteProps,
} from "@airbnb/lunar/lib/components/Autocomplete";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

export const autcompleteStyleSheet: StyleSheet = ({ unit }) => ({
  autcomplete_wrap: {
    "@selectors": {
      "> section > div > div > div > div > input": {
        borderWidth: 1,
        "::-webkit-search-cancel-button": {
          display: "none",
        },
      },
      "> section > div > label": {
        marginBottom: unit / 2,
      },
    },
  },
});

export default function Input(props: AutocompleteProps) {
  const [styles, cx] = useStyles(autcompleteStyleSheet);

  return (
    <div className={cx(styles.autcomplete_wrap)}>
      <LunarAutocomplete {...props} />
    </div>
  );
}
