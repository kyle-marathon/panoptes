import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import Spacing from "@airbnb/lunar/lib/components/Spacing";

import Card from "../Card";

export const styleSheet: StyleSheet = ({ color, font, unit }) => ({
  subitem_italic: {
    fontStyle: "italic",
  },
});

export default function SubItemCard({
  small = true,
  micro = false,
  isDragging,
  children,
  italic,
}: {
  small?: boolean;
  micro?: boolean;
  isDragging?: boolean;
  children: JSX.Element | string;
  italic?: boolean;
}) {
  const [styles, cx] = useStyles(styleSheet);

  return (
    <Spacing inner top={0.5}>
      <Card noShadow={!isDragging} overflow>
        <Spacing vertical={small ? 0.5 : 1} horizontal={micro ? 0 : 1.5}>
          <div className={cx(italic && styles.subitem_italic)}>{children}</div>
        </Spacing>
      </Card>
    </Spacing>
  );
}
