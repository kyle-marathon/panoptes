import { useState } from "react";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

import toRGBA from "@airbnb/lunar/lib/utils/toRGBA";

export const editorStyleSheet: StyleSheet = ({ color, font, unit, ui }) => ({
  button_wrap_hidden: {
    opacity: 0,
  },
  hidden_button_wrap: {
    cursor: "pointer",
    opacity: 1,
    width: "100%",
    height: 10,
    position: "absolute",
  },
  hidden_button_wrap_top: {
    top: -11,
    left: 4,
  },
  hidden_button_wrap_bottom: {
    bottom: 1,
    left: 4,
  },
  hidden_button_wrap_left: {
    left: -14,
    // top: -4,
    top: 6,
  },
  button_wrap_transition: {
    transition: "opacity 75ms ease-in-out",
  },
  hidden_buttons: {
    position: "absolute",
    zIndex: 10,
    display: "flex",
  },
  hidden_buttons_left: {
    flexDirection: "column",
  },
  hidden_button: {
    // border: `1px solid ${toRGBA(color.accent.border, 50)}`,
    border: `1px solid ${color.accent.border}`,
    borderRadius: ui.borderRadius,
    background: color.accent.bg,
    padding: unit / 4,
    marginRight: 2,
    marginLeft: 2,
    transition: "background 175ms ease-in-out",

    ":hover": {
      backgroundColor: color.accent.bgHover,
    },
  },
});

type Props = {
  position?: "top" | "bottom" | "left";
  isHidden: boolean;
  children: JSX.Element;
};

export default function HiddenButtons({
  position = "bottom",
  isHidden = true,
  children,
}: Props) {
  const [styles, cx] = useStyles(editorStyleSheet);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  if (!isHidden && !hasBeenShown) {
    setHasBeenShown(true);
  }

  return (
    <div
      className={cx(
        styles.hidden_button_wrap,
        isHidden && styles.button_wrap_hidden,
        hasBeenShown && styles.button_wrap_transition,
        position == "top" && styles.hidden_button_wrap_top,
        position == "bottom" && styles.hidden_button_wrap_bottom,
        position == "left" && styles.hidden_button_wrap_left
      )}
    >
      <div
        className={cx(
          styles.hidden_buttons,
          position == "left" && styles.hidden_buttons_left
        )}
      >
        {children}
      </div>
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
