export default function Settings() {
  return <div>settings</div>;
}

// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import { useSetRecoilState, useRecoilState } from "recoil";

// import { signOut } from "firebase/auth";
// import { auth } from "../setup/setupFirebase";
// import { useAuthState } from "react-firebase-hooks/auth";

// import Switch from "@airbnb/lunar/lib/components/Switch";
// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import Button from "@airbnb/lunar/lib/components/Button";
// import Row from "./Row";

// import { UID_KEY } from "../utils/constants";
// import { configState, uidState } from "../atoms";

// export const settingsStyleSheet: StyleSheet = ({ color, font, unit }) => ({
//   settings: {
//     maxWidth: "50%",
//     margin: "auto",
//   },
//   center: {
//     display: "grid",
//   },
// });

// export default function Settings() {
//   const [styles, cx] = useStyles(settingsStyleSheet);
//   const [config, setConfig] = useRecoilState(configState);
//   const setUid = useSetRecoilState(uidState);

//   const { showDetails, showCompleted } = config;

//   return (
//     <div className={cx(styles.settings)}>
//       <Switch
//         small
//         checked={!showDetails}
//         label="Hide details"
//         onChange={() => {
//           setConfig({
//             ...config,
//             showDetails: !showDetails,
//           });
//         }}
//       />
//       <Switch
//         small
//         checked={!showCompleted}
//         label="Hide completed"
//         onChange={() => {
//           setConfig({
//             ...config,
//             showCompleted: !showCompleted,
//           });
//         }}
//       />
//       <div className={cx(styles.center)}>
//         <Button
//           small
//           inverted
//           onClick={() => {
//             signOut(auth);
//             setUid("");
//             window.localStorage.setItem(UID_KEY, "");
//           }}
//         >
//           Logout
//         </Button>
//       </div>
//     </div>
//   );
// }
