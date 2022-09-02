import { atom } from "recoil";

export const uidState = atom({
  key: "uid", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const lastIdState = atom({
  key: "lastId",
  default: 0,
});
