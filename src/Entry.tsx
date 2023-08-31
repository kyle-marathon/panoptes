import "./setup/setTheme";

import { useEffect, useState, useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import Menu, { Item as MenuItem } from "@airbnb/lunar/lib/components/Menu";
import MenuToggle from "@airbnb/lunar/lib/components/MenuToggle";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onValue, getDatabase, ref, get, child } from "firebase/database";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkiUbpwAWHWyUcjVLOhxDrOhChURuw4Ko",
  authDomain: "pano-41fdf.firebaseapp.com",
  databaseURL: "https://pano-41fdf-default-rtdb.firebaseio.com",
  projectId: "pano-41fdf",
  storageBucket: "pano-41fdf.appspot.com",
  messagingSenderId: "572566267300",
  appId: "1:572566267300:web:95ee7f86e4415ebb528d31",
  measurementId: "G-WL49STLDQ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

type Property = {
  index: number;
  name: string;
};

const db = getDatabase();

// interval in seconds
const interval = 0.5;
const avgOver = 32;
const numPoints = avgOver * 30;

export default function Entry() {
  const [data, setData] = useState<{ [key: string]: number }[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyIdx, setPropertyIdx] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState("");

  // const property = properties[propertyIdx]?.name;

  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth() + 1;
  const day = today.getUTCDate();
  const hour = today.getUTCHours();

  const getAvgData = (dataKey: string) => {
    const out: { x: number }[] = [];
    data.forEach((row, idx) => {
      if (idx % avgOver == 0) {
        out.push({ x: 0 });
      }
      const arrIndex = Math.floor(idx / avgOver);
      const val = row[dataKey] / avgOver;
      out[arrIndex].x += val;
    });
    return out;
  };

  const getDerivative = (arr: { x: number }[]) => {
    const out: { x: number }[] = [];
    arr.slice(0, -1).forEach((row, idx) => {
      out.push({
        x: (arr[idx + 1].x - arr[idx].x) / (interval * avgOver),
      });
    });
    return out;
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `EosOne/${year}/${month}/${day}/${hour}/data`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const db_data = snapshot.val();
          const keys = Object.keys(db_data);
          const newProperties = db_data[keys[0]].properties
            .map((property: string, idx: number) => ({
              index: idx,
              name: property,
            }))
            .filter((property: Property) => property.name.length > 0);
          setProperties(newProperties);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const dataQuery = ref(db, `EosOne/${year}/${month}/${day}/${hour}/data`);
    return onValue(dataQuery, (snapshot) => {
      const streamingData = snapshot.val();
      const keys = Object.keys(streamingData).slice(-numPoints);
      const tempData: any[] = [];
      keys.forEach((key) => {
        const newDataRow: { [key: string]: any } = {};
        streamingData[key].values.forEach((value: number, idx: number) => {
          newDataRow[`value_${idx}`] = value;
        });
        tempData.push(newDataRow);
      });
      setData(tempData);
    });
  }, []);

  useEffect(() => {
    console.log("using effect last updated");
    const lastUpdatedQuery = ref(db, "EosOne/last_updated");

    return onValue(lastUpdatedQuery, (snapshot) => {
      setLastUpdated(snapshot.val());
    });
  }, []);

  // console.log(data);

  const menuItems = properties.map(({ name, index }) => (
    <MenuItem
      key={name}
      onClick={() => {
        setPropertyIdx(index);
      }}
    >
      {name}
    </MenuItem>
  ));

  const menu = (
    <MenuToggle
      closeOnClick
      accessibilityLabel="Properties"
      toggleLabel={properties[propertyIdx]?.name}
      zIndex={10}
      dropdownProps={{
        left: 0,
      }}
    >
      {menuItems}
    </MenuToggle>
  );

  const dataKey = "value_1";
  const dataComboDownAvg = getAvgData(dataKey);
  const chartComboDownAvg = (
    <LineChart width={800} height={300} data={dataComboDownAvg}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey={dataKey} />
      <YAxis
        domain={["dataMin", "dataMax"]}
        width={100}
        tickFormatter={(x) => {
          return Number.parseFloat(x).toExponential(2);
        }}
      />
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
      />
    </LineChart>
  );

  const dataComboDownDydx = getDerivative(dataComboDownAvg);
  const chartComboDownDydx = (
    <LineChart width={800} height={300} data={dataComboDownDydx}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey={dataKey} />
      <YAxis
        domain={["dataMin", "dataMax"]}
        width={100}
        tickFormatter={(x) => {
          return Number.parseFloat(x).toExponential(2);
        }}
      />
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
      />
    </LineChart>
  );

  const dataKey2 = "value_2";

  const dataComboUpAvg = getAvgData(dataKey2);
  const chartComboUpAvg = (
    <LineChart width={800} height={300} data={dataComboUpAvg}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey={dataKey2} />
      <YAxis
        domain={["dataMin", "dataMax"]}
        width={100}
        tickFormatter={(x) => {
          return Number.parseFloat(x).toExponential(2);
        }}
      />
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
      />
    </LineChart>
  );

  const dataComboUpDydx = getDerivative(dataComboUpAvg);
  const chartComboUpDydx = (
    <LineChart width={800} height={300} data={dataComboUpDydx}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey={dataKey2} />
      <YAxis
        domain={["dataMin", "dataMax"]}
        width={100}
        tickFormatter={(x) => {
          return Number.parseFloat(x).toExponential(2);
        }}
      />
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
      />
    </LineChart>
  );

  return (
    <div>
      <div
        style={{
          padding: 12,
        }}
      >
        <div
          style={{
            paddingBottom: 12,
          }}
        >
          {/* {menu} */}
        </div>
        <div>Last updated: {lastUpdated}</div>
        {/* <div>Last read: {data.slice(-1)[dataKey]}</div> */}
        Combo Up Avg over {avgOver * interval} seconds
        <div>{chartComboUpAvg}</div>
        Combo Up DyDx (change per second)
        <div>{chartComboUpDydx}</div>
        Combo Down Avg over {avgOver * interval} seconds
        <div>{chartComboDownAvg}</div>
        Combo Down DyDx (change per second)
        <div>{chartComboDownDydx}</div>
      </div>
    </div>
  );
}

// import { useEffect } from "react";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

// import Tabs, { Tab } from "@airbnb/lunar/lib/components/Tabs";

// import Text from "@airbnb/lunar/lib/components/Text";
// import IconSettings from "@airbnb/lunar-icons/lib/interface/IconSettings";
// import IconInbox from "@airbnb/lunar-icons/lib/interface/IconInbox";
// import IconVideoGame from "@airbnb/lunar-icons/lib/general/IconVideoGame";
// import IconHome from "@airbnb/lunar-icons/lib/general/IconHome";

// import { ref, onValue } from "firebase/database";
// import "firebaseui/dist/firebaseui.css";
// import { auth } from "./setup/setupFirebase";
// import { useAuthState } from "react-firebase-hooks/auth";

// import { db, lastIdPath, hasItemsPath } from "./setup/setupFirebase";
// import {
//   RecoilRoot,
//   useRecoilValue,
//   useSetRecoilState,
//   useRecoilState,
// } from "recoil";

// import { MOCK_ITEMS } from "./utils/mockData";
// import { Items } from "./utils/types";

// import Login from "./components/Login";
// import App from "./App";
// import Team from "./components/Team";
// import Spaced from "./components/Spaced";
// import Settings from "./components/Settings";

// import { getBodyWidth } from "./utils/utils";
// import {
//   uidState,
//   lastIdState,
//   pkdState,
//   hasItemsState,
//   itemsState,
//   isOnlineState,
// } from "./atoms";
// import { UID_KEY } from "./utils/constants";

// import pokepack from "./assets/pokepack.svg";

// export const appStyleSheet: StyleSheet = ({ color, font, unit }) => ({
//   body: {
//     width: getBodyWidth(unit),
//     // marginBottom: unit * 10,
//     padding: unit * 3,
//     paddingBottom: unit * 5,
//     height: "100vh",
//     overflow: "hidden",
//   },
//   center: {
//     display: "flex",
//     justifyContent: "center",
//   },
//   tabs_wrap: {
//     height: "100%",
//     "@selectors": {
//       "> div": {
//         height: "100%",
//       },
//       "> div > div": {
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       },
//       "> div > div > section": {
//         flex: "1 1 1px",
//         overflow: "hidden",
//       },
//       "> div > div > section > div": {
//         height: "100%",
//       },
//       "> div > div > nav": {
//         marginBottom: 2 * unit,
//       },
//       "> div > div > nav > span > div > button": {
//         paddingLeft: unit * 2,
//         paddingRight: unit * 2,
//       },
//     },
//   },
//   pokeLogo: {
//     background: `rgba(255,0,0,0) url(${pokepack}) -30px -30px`,
//     backgroundSize: 26,
//     width: 16,
//     height: 16,
//     // https://codepen.io/sosuke/pen/Pjoqqp
//     filter:
//       "invert(95%) sepia(93%) saturate(0%) hue-rotate(248deg) brightness(104%) contrast(64%)",
//   },
// });

// export function EntryWithRecoil() {
//   const [user, loading, error] = useAuthState(auth);
//   const [uid, setUid] = useRecoilState(uidState);
//   const [pkd, setPkd] = useRecoilState(pkdState);
//   const [items, setItems] = useRecoilState<Items>(itemsState);
//   const [hasItems, setHasItems] = useRecoilState(hasItemsState);
//   const isOnline = useRecoilValue(isOnlineState);
//   const [styles, cx] = useStyles(appStyleSheet);

//   const setLastId = useSetRecoilState(lastIdState);

//   useEffect(() => {
//     const localUid = window.localStorage.getItem(UID_KEY);
//     if (localUid && !uid) {
//       setUid(localUid);
//     }
//   }, []);

//   useEffect(() => {
//     if (user) {
//       const idRef = ref(db, `${user.uid}/pkd`);
//       onValue(idRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           setPkd(data);
//         }
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       const { uid } = user;
//       setUid(uid);
//       window.localStorage.setItem(UID_KEY, uid);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       const idRef = ref(db, `${user.uid}/${lastIdPath}`);
//       onValue(idRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           setLastId(data);
//         }
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       const hasItemsRef = ref(db, `${user.uid}/${hasItemsPath}`);
//       onValue(hasItemsRef, (snapshot) => {
//         const data = snapshot.val();
//         setHasItems(data);
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!isOnline) {
//       setItems(MOCK_ITEMS.FhIIpYHfumVyad0TJ67rSh0ZOMJ3.tasks);
//     } else if (user) {
//       const tasksRef = ref(db, `${user.uid}/tasks`);
//       onValue(tasksRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           setItems(data);
//         }
//       });
//     }
//   }, [user]);

//   if (uid || loading) {
//     return (
//       <div className={cx(styles.center)}>
//         <div className={cx(styles.body)}>
//           <div className={cx(styles.tabs_wrap)}>
//             <Tabs persistWithHash="page" defaultKey="priorities">
//               <Tab
//                 key="priorities"
//                 label="Priorities"
//                 afterIcon={<IconHome decorative />}
//               >
//                 <App loading={loading} />
//               </Tab>
//               <Tab
//                 key="cards"
//                 label="Cards"
//                 afterIcon={<IconInbox decorative />}
//               >
//                 <Spaced loading={loading} />
//               </Tab>
//               <Tab
//                 key="team"
//                 label="Team"
//                 // afterIcon={<div className={cx(styles.pokeLogo)} />}
//                 afterIcon={<IconVideoGame decorative />}
//               >
//                 <Team loading={loading} />
//               </Tab>
//               <Tab
//                 key="settings"
//                 label="Settings"
//                 afterIcon={<IconSettings decorative />}
//               >
//                 <Settings />
//               </Tab>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     );
//   } else if (loading) {
//     return <></>;
//   }

//   return <Login />;
// }

// export default function Entry() {
//   return <div>hello world</div>;

// return (
//   <RecoilRoot>
//     <EntryWithRecoil />
//   </RecoilRoot>
// );
// }
