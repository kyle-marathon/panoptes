import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import Spacing from "@airbnb/lunar/lib/components/Spacing";

import Card from "../Card";

export const styleSheet: StyleSheet = ({ color, font, unit }) => ({
  subitem: {},
});

export default function SubItemCard({
  isDragging,
  children,
}: {
  isDragging?: boolean;
  children: JSX.Element | string;
}) {
  const [styles, cx] = useStyles(styleSheet);

  return (
    <Spacing inner top={0.5} left={0}>
      <Card noShadow={!isDragging} overflow>
        <Spacing inner vertical={0.5} horizontal={1.5}>
          <div className={cx(styles.subitem)}>{children}</div>
        </Spacing>
      </Card>
    </Spacing>
  );
}
