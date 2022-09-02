import Spacing from "@airbnb/lunar/lib/components/Spacing";

import Card from "../Card";

export default function SubItemCard({
  isDragging,
  children,
}: {
  isDragging?: boolean;
  children: JSX.Element | string;
}) {
  return (
    <Spacing inner bottom={0.5} left={5}>
      <Card noShadow={!isDragging} overflow>
        <Spacing inner vertical={0.5} horizontal={1}>
          {children}
        </Spacing>
      </Card>
    </Spacing>
  );
}
