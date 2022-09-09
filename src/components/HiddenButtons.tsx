import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

import toRGBA from "@airbnb/lunar/lib/utils/toRGBA";

export const editorStyleSheet: StyleSheet = ({ color, font, unit, ui }) => ({
  button_wrap_hidden: {
    opacity: 0,
  },
  hidden_button_wrap: {
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 175ms ease-in-out",
    width: "100%",
    height: 10,
    position: "absolute",
    bottom: 1,
    // display: "flex",
    // justifyContent: "center",
  },
  hidden_buttons: {
    position: "absolute",
    zIndex: 10,
    display: "flex",
  },
  hidden_button: {
    border: `1px solid ${toRGBA(color.accent.border, 50)}`,
    borderRadius: ui.borderRadius,
    background: "white",
    padding: unit / 4,
    marginRight: 5,
    marginLeft: 5,
    transition: "background 175ms ease-in-out",

    ":hover": {
      background: color.core.neutral[0],
    },
  },
});

type Props = {
  isHidden: boolean;
  children: JSX.Element;
};

export default function HiddenButtons({ isHidden, children }: Props) {
  const [styles, cx] = useStyles(editorStyleSheet);

  return (
    <div
      className={cx(
        styles.hidden_button_wrap,
        isHidden && styles.button_wrap_hidden
      )}
    >
      <div className={cx(styles.hidden_buttons)}>{children}</div>
    </div>
  );
}

type ButtonProps = {
  children: JSX.Element;
  onClick: () => void;
};

export function HiddenButton({ children, onClick }: ButtonProps) {
  const [styles, cx] = useStyles(editorStyleSheet);

  return (
    <div className={cx(styles.hidden_button)} onClick={onClick}>
      {children}
    </div>
  );
}

// <div
// className={cx(styles.hidden_button)}
// onClick={() => {
//   set(ref(db, `${uid}/tasks/${id}/hideToolbar`), !hideToolbar);
//   setHideToolbar(!hideToolbar);
// }}
// >
// {hideToolbar ? <IconClose decorative /> : <IconAdd decorative />}
// </div>
// <div
// className={cx(styles.hidden_button)}
// onClick={() => {
//   set(ref(db, `${uid}/tasks/${id}/collapsed`), !collapsed);

//   setCollapsed(!collapsed);
// }}
// >
// {collapsed ? (
//   <IconChevronDown decorative />
// ) : (
//   <IconChevronUp decorative />
// )}
// </div>
