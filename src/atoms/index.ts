import { atom } from "recoil";

export const uidState = atom({
  key: "uid", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const lastIdState = atom({
  key: "lastId",
  default: 0,
});

export const pkdState = atom({
  key: "pkd",
  default: 0,
});

export const showPacksState = atom({
  key: "showPacks",
  default: false,
});

export const isOnlineState = atom({
  key: "isOnline",
  // default: !window.location.href.includes("localhost"),
  default: true,
});

export const itemsState = atom({
  key: "items",
  default: {},
});

export const hasItemsState = atom({
  key: "hasItems",
  default: true,
});

export const configState = atom({
  key: "config",
  default: {
    showDetails: true,
    showCompleted: true,
  },
});
