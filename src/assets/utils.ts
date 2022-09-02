import { Item } from "./types";

export const msToDays = (ms: number) => ms / 1000 / 60 / 60 / 24;

export const isItemRenewed = (item: Item) =>
  item.frequency &&
  item.lastCompleted &&
  item.lastCompleted.length > 0 &&
  msToDays(
    new Date().getTime() -
      new Date(item.lastCompleted[item.lastCompleted.length - 1]).getTime()
  ) > item.frequency;

export const isItemExhausted = (item: Item) =>
  (item.times && item.completed >= item.times) ||
  (!item.times && item.completed > 0);

export const isItemSatisfied = (item: Item) =>
  item.required &&
  item.subtasks &&
  Object.values(item.subtasks).filter((subtask) => subtask.completed).length >=
    item.required;

export const isItemLive = (item: Item) => {
  return (
    (isItemRenewed(item) || !isItemExhausted(item)) && !isItemSatisfied(item)
  );
};

const numEndings: { [key: number]: string } = {
  1: "st",
  2: "nd",
  3: "rd",
};

export const formatedDate = (date: Date) => {
  const day = date.getDate();
  const lastDigit = day % 10;
  const ending = lastDigit in numEndings ? numEndings[lastDigit] : "th";

  return `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getDate()}${ending}]`;
};
