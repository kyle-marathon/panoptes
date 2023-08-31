import React from "react";
import ReactDOM from "react-dom/client";
import Entry from "./Entry";
// import { db, dbRef, testVar } from "./setup/setupFirebase";
// import { get, child } from "firebase/database";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Entry />);
