export default function Team() {
  return <div>settings</div>;
}

// import { useEffect, useState } from "react";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
// import { useRecoilValue, useRecoilState } from "recoil";
// import { set, update, get, ref, remove } from "firebase/database";

// import { db } from "../../setup/setupFirebase";

// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import Text from "@airbnb/lunar/lib/components/Text";
// import Button from "@airbnb/lunar/lib/components/Button";

// import Row from "../Row";

// import sprites from "../../assets/sprites.png";
// import sprites2 from "../../assets/sprites2.png";
// import pokedollar from "../../assets/pokedollar.png";
// import pokepack from "../../assets/pokepack.svg";

// import { pkdState, showPacksState, uidState } from "../../atoms";
// import { PKD_KEY } from "../../utils/constants";
// import useTheme from "@airbnb/lunar/lib/hooks/useTheme";

// export const appStyleSheet: StyleSheet = ({ unit }) => ({
//   team: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   mons_display: {
//     flex: "1 1 1px",
//     marginTop: 2 * unit,
//     overflow: "auto",
//     "@selectors": {
//       "::-webkit-scrollbar": {
//         display: "none",
//       },
//     },
//   },
//   mons: {
//     width: "100%",
//     display: "flex",
//     justifyContent: "center",
//     flexWrap: "wrap",
//   },
//   maxWidth: {
//     maxWidth: unit * 40,
//     margin: "auto",
//     display: "flex",
//     paddingTop: unit * 2,
//   },
//   container: {
//     position: "relative",
//     overflow: "hidden",
//   },
//   clip: {
//     // position: "absolute",
//     display: "inline-block",
//   },
//   pkd: {
//     width: 9,
//     filter: "invert(28.3%)",
//     position: "relative",
//     bottom: 2,
//   },
//   pack: {
//     height: 100,
//   },
//   packs: {},
// });

// // x, y from top left corner

// // [27, 16],
// const packIndices = [
//   [
//     [10, 0],
//     [13, 0],
//     [16, 0],
//     [19, 0],
//     [20, 0],
//     [22, 0],
//     [26, 0],
//     [23, 1],
//     [25, 1],
//     [3, 1],
//     [1, 1],
//     [6, 1],
//     [17, 1],
//     [19, 1],
//     [14, 1],
//     [3, 2],
//     [6, 2],
//     [9, 2],
//     [12, 2],
//     [15, 2],
//   ],
//   [
//     [12, 7],
//     [2, 11],
//     [26, 10],
//     [1, 15],
//     [25, 16],
//     [26, 8],
//     [6, 12],
//     [15, 7],
//     [15, 13],
//     [26, 3],
//     [22, 3],
//     [24, 9],
//     [27, 9],
//     [23, 14],
//     [22, 1],
//     [8, 0],
//     [16, 15],
//     [9, 11],
//     [1, 7],
//     [24, 8],
//   ],
//   [
//     [2, 8],
//     [5, 8],
//     [26, 2],
//     [4, 12],
//     [11, 15],
//     [8, 9],
//     [24, 5],
//     [16, 13],
//     [13, 15],
//     [7, 6],
//     [17, 3],
//     [10, 9],
//     [17, 2],
//     [18, 1],
//     [6, 12],
//     [4, 2],
//     [0, 1],
//     [17, 7],
//     [17, 1],
//     [17, 5],
//   ],
// ];

// const packCosts = [10, 25, 100];

// const dimensions = [80, 80];

// export default function Team({ loading }: { loading: boolean }) {
//   const [styles, cx] = useStyles(appStyleSheet);
//   const [pkd, setPkd] = useRecoilState(pkdState);
//   const showPacks = useRecoilValue(showPacksState);
//   const [hoveredPack, setHoveredPack] = useState<number>(-1);
//   const [selectedPack, setSelectedPack] = useState<number>(0);
//   const [hoverIdx, setHoverIdx] = useState(-1);
//   const [monsData, setMonsData] = useState<number[][]>([]);
//   const uid = useRecoilValue(uidState);

//   const dbPath = `${uid}/mons`;

//   useEffect(() => {
//     if (!loading) {
//       get(ref(db, dbPath)).then((snapshot) => {
//         if (snapshot.exists()) {
//           setMonsData(
//             Object.keys(snapshot.val()).map((monKey) =>
//               monKey.split("-").map((x) => parseInt(x))
//             )
//           );
//         }
//       });
//     }
//   }, [loading]);

//   const monsKeys = new Set(
//     monsData.map((monData) => `${monData[0]}-${monData[1]}`)
//   );

//   const mons = monsData.map((mon, index) => (
//     <Spacing inline horizontal={0.5} vertical={1.5} key={`${mon[0]}-${mon[1]}`}>
//       <div
//         onMouseOver={() => setHoverIdx(index)}
//         onMouseOut={() => setHoverIdx(-1)}
//         className={cx(styles.clip, {
//           background: `url(${index === hoverIdx ? sprites2 : sprites}) ${
//             -mon[0] * dimensions[0]
//           }px ${-mon[1] * dimensions[1]}px`,
//           width: dimensions[0],
//           height: dimensions[1],
//         })}
//       ></div>
//     </Spacing>
//   ));

//   const packData = [
//     {
//       backgroundColor: `#db372c`,
//       backgroundImage: `linear-gradient(180deg, #db372c 0%, #fff0ed 70%)`,
//       imgStyles: {
//         filter: "contrast(80%) invert()",
//       },
//     },
//     {
//       backgroundColor: "#ffffff",
//       backgroundImage: `
//         linear-gradient(155deg,
//           rgba(0, 0, 0, 0) 35%,
//           rgba(196, 46, 35, 0.7) 45%,
//           rgba(0, 0, 0, 0) 65%
//         ),
//         linear-gradient(180deg,
//           rgba(18, 59, 122, 0.8) 0%,
//           rgba(18, 59, 122, 1) 40%,
//           rgba(255, 255, 255, 1) 90%
//         )
//       `,
//       imgStyles: {
//         filter: "opacity(90%) invert()",
//       },
//     },
//     // Ultra ball
//     {
//       backgroundColor: "#ffffff",
//       backgroundImage: `
//         linear-gradient(155deg,
//           rgba(0, 0, 0, 0) 35%,
//           rgba(6, 26, 15, 0.9) 40%,
//           rgba(0, 0, 0, 0) 44%
//         ),
//         linear-gradient(25deg,
//           rgba(0, 0, 0, 0) 70%,
//           rgba(6, 26, 15, 0.9) 75%,
//           rgba(0, 0, 0, 0) 85%
//         ),
//         linear-gradient(180deg,
//           rgba(211, 171, 80, 0.8) 0%,
//           rgba(211, 171, 80, 1) 40%,
//           rgba(255, 255, 255, 1) 90%
//         )
//       `,
//       imgStyles: {
//         filter: "opacity(90%) invert()",
//       },
//     },
//     // Master ball
//     // {
//     //   backgroundColor: `#4158D0`,
//     //   backgroundImage: `
//     //     linear-gradient(53deg, #4158D0 0%, #C850C0 76%, #d44a7f 100%),
//     //     linear-gradient(153deg, #4158D0 0%, #C850C0 76%, #d44a7f 100%)`,
//     //   imgStyles: {
//     //     filter: "invert()",
//     //   },
//     // },
//   ];

//   const pokePacks = packData.map((packDatum, index) => (
//     <Spacing bottom={1} key={index}>
//       <div
//         className={cx({
//           position: "relative",
//           width: 40,
//           height: 40,
//           display: "inline-block",
//           cursor: "pointer",
//         })}
//         onMouseOver={() => setHoveredPack(index)}
//         onMouseOut={() => setHoveredPack(-1)}
//         onClick={() => setSelectedPack(index)}
//       >
//         <div
//           className={cx({
//             width: 38,
//             height: 38,
//             position: "absolute",
//             opacity: index == selectedPack ? 1 : 0.7,
//             borderRadius: 8,
//             filter:
//               index == hoveredPack || index == selectedPack ? "blur(8px)" : "",
//             transition: "filter 275ms ease, opacity 275ms ease",
//             top: 1,
//             left: 1,
//             ...packDatum,
//           })}
//         />
//         <div
//           className={cx({
//             width: 38,
//             height: 38,
//             position: "absolute",
//             opacity: 1,
//             borderRadius: 8,
//             transition: "filter 275ms ease",
//             top: 1,
//             left: 1,
//             ...packDatum,
//           })}
//         />
//         <div
//           className={cx({
//             background: `url(${pokepack}) -30px -30px`,
//             backgroundSize: 100,
//             width: 40,
//             height: 40,
//             position: "absolute",
//             ...packDatum.imgStyles,
//           })}
//         />
//       </div>
//     </Spacing>
//   ));

//   const scale = 0.5;
//   const previewMons =
//     selectedPack >= 0 &&
//     packIndices[selectedPack].map((mon) => (
//       <div
//         key={`${mon[0]}-${mon[1]}`}
//         className={cx({
//           position: "relative",
//           display: "inline-block",
//           top: 4,
//         })}
//       >
//         <div
//           className={cx(styles.clip, {
//             background: `url(${sprites}) ${-mon[0] * dimensions[0]}px ${
//               -mon[1] * dimensions[1]
//             }px`,
//             width: dimensions[0],
//             height: dimensions[1],
//             transform: `scale(${scale})`,
//             marginRight: `-30px`,
//             marginTop: `-30px`,
//             filter: monsKeys.has(`${mon[0]}-${mon[1]}`)
//               ? ""
//               : "saturate(300%) blur(20px)",
//             transition: "filter 275ms cubic-bezier(0.45, 0.083, .73, 0.13)",
//           })}
//         />
//         <div
//           key={`${mon[0]}-${mon[1]}`}
//           className={cx(styles.clip, {
//             background: `url(${sprites}) ${-mon[0] * dimensions[0]}px ${
//               -mon[1] * dimensions[1]
//             }px`,
//             width: dimensions[0],
//             height: dimensions[1],
//             transform: `scale(${scale})`,
//             marginRight: `-30px`,
//             marginTop: `-30px`,
//             filter: monsKeys.has(`${mon[0]}-${mon[1]}`)
//               ? ""
//               : "brightness(0%) blur(1px)",
//             transition: "filter 275ms cubic-bezier(0.45, 0.083, .73, 0.13)",
//             position: "absolute",
//             left: 0,
//           })}
//         />
//       </div>
//     ));

//   const packs = (
//     <div className={cx(styles.maxWidth)}>
//       <div
//         className={cx({
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         })}
//       >
//         {pokePacks}
//         <Button
//           small
//           inverted
//           onClick={() => {
//             if (
//               pkd >= packCosts[selectedPack] &&
//               packIndices[selectedPack].some(
//                 (mon) => !monsKeys.has(`${mon[0]}-${mon[1]}`)
//               )
//             ) {
//               const newPkd = pkd - packCosts[selectedPack];
//               setPkd(newPkd);
//               set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

//               let newMonIndx = Math.floor(
//                 Math.random() * packIndices[selectedPack].length
//               );
//               let newMon = packIndices[selectedPack][newMonIndx];
//               while (monsKeys.has(`${newMon[0]}-${newMon[1]}`)) {
//                 newMonIndx = Math.floor(
//                   Math.random() * packIndices[selectedPack].length
//                 );
//                 newMon = packIndices[selectedPack][newMonIndx];
//               }

//               set(ref(db, `${dbPath}/${newMon[0]}-${newMon[1]}`), true);
//               setMonsData((monsData) => [...monsData, newMon]);
//             }
//           }}
//         >
//           Throw
//         </Button>
//       </div>
//       <div>{previewMons}</div>
//     </div>
//   );

//   const { color } = useTheme();

//   return (
//     <div className={cx(styles.team)}>
//       <Spacing top={3}>{packs}</Spacing>
//       <div className={cx({ marginLeft: 178, marginTop: -5 })}>
//         <Spacing inline right={0.5}>
//           <img className={cx(styles.pkd)} src={pokedollar} />
//         </Spacing>
//         <Text inline>
//           {pkd}
//           {pkd > 0 && ",000"}
//           {selectedPack >= 0 ? (
//             <div
//               className={cx({ color: color.core.danger[2], display: "inline" })}
//             >{` (-${packCosts[selectedPack]},000)`}</div>
//           ) : (
//             ""
//           )}
//         </Text>
//       </div>
//       <div className={cx(styles.mons_display)}>
//         <div className={cx(styles.mons)}>{mons}</div>
//       </div>
//     </div>
//   );
// }
