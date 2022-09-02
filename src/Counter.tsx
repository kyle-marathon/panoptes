import { memo } from "react";

function InnerCounter({
  value,
  handleClick,
}: {
  value: number;
  handleClick?: () => void;
}) {
  console.log("updating");
  // return <button>{value}</button>;
  return <button onClick={handleClick}>{value}</button>;
}

export const Counter = memo(InnerCounter);
