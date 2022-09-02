import { useCallback, useState } from "react";

import { Counter } from "./Counter";

const arr = [1, 3, 5, 7];

export default function Test() {
  const [values, setValues] = useState<number[]>(arr);
  const [counter, setCounter] = useState<number>(0);

  const handleClick = () => {
    setValues((values) => {
      const newValues = [...values];
      newValues.splice(1, 1, values[1] + 1);
      return newValues;
    });
  };

  const memoizedCallback = useCallback(handleClick, []);

  return (
    <div>
      {values.map((value, index) => (
        <Counter key={index} value={value} handleClick={memoizedCallback} />
      ))}
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
