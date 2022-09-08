import { useEffect, useState } from "react";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import { useRecoilValue, useRecoilState } from "recoil";
import { set, update, get, ref, remove } from "firebase/database";

import { db } from "../../setup/setupFirebase";

import Spacing from "@airbnb/lunar/lib/components/Spacing";
import Text from "@airbnb/lunar/lib/components/Text";

import sprites from "../../assets/sprites.png";
import sprites2 from "../../assets/sprites2.png";
import pokedollar from "../../assets/pokedollar.png";
import pokepack from "../../assets/pokepack.svg";

import { pkdState, showPacksState, uidState } from "../../atoms";
import { PKD_KEY } from "../../utils/constants";

export const appStyleSheet: StyleSheet = () => ({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  clip: {
    // position: "absolute",
    display: "inline-block",
  },
  pkd: {
    width: 9,
    filter: "invert(28.3%)",
    position: "relative",
    bottom: 2,
  },
  pack: {
    height: 100,
  },
  packs: {},
});

// x, y from top left corner

const packIndices = [
  [
    [0, 1],
    [2, 1],
    [10, 1],
    [10, 16],
    [1, 1],
    [3, 1],
  ],
  [
    [0, 1],
    [2, 3],
    [10, 10],
    [10, 17],
    [0, 14],
    [3, 1],
  ],
  [
    [4, 0],
    [7, 2],
    [14, 9],
    [14, 16],
    [3, 13],
    [8, 0],
  ],
];

const packCosts = [10, 25, 100];

const dimensions = [80, 80];

export default function Team() {
  const [styles, cx] = useStyles(appStyleSheet);
  const [pkd, setPkd] = useRecoilState(pkdState);
  const showPacks = useRecoilValue(showPacksState);
  const [packPreview, setPackPreview] = useState<number>(-1);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [monsData, setMonsData] = useState<number[][]>([]);
  const uid = useRecoilValue(uidState);

  const dbPath = `${uid}/mons`;

  useEffect(() => {
    get(ref(db, dbPath)).then((snapshot) => {
      if (snapshot.exists()) {
        setMonsData(
          Object.keys(snapshot.val()).map((monKey) =>
            monKey.split("-").map((x) => parseInt(x))
          )
        );
      }
    });
  }, []);

  // console.log(monsData);

  const monsKeys = new Set(
    monsData.map((monData) => `${monData[0]}-${monData[1]}`)
  );

  const mons = monsData.map((mon, index) => (
    <div
      key={`${mon[0]}-${mon[1]}`}
      onMouseOver={() => setHoverIdx(index)}
      onMouseOut={() => setHoverIdx(-1)}
      className={cx(styles.clip, {
        background: `url(${index === hoverIdx ? sprites2 : sprites}) ${
          -mon[0] * dimensions[0]
        }px ${-mon[1] * dimensions[1]}px`,
        width: dimensions[0],
        height: dimensions[1],
      })}
    ></div>
  ));

  const packData = [
    {
      backgroundColor: `#FFDEE9`,
      imgStyles: {
        filter: "contrast(80%)",
      },
    },
    {
      backgroundColor: `#A9C9FF`,
      backgroundImage: `linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)`,
      imgStyles: {
        filter: "opacity(90%)",
      },
    },
    {
      backgroundColor: `#4158D0`,
      backgroundImage: `linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)`,
      imgStyles: {
        filter: "invert()",
      },
    },
  ];

  const pokePacks = packData.map((packDatum, index) => (
    <div
      key={index}
      className={cx({
        position: "relative",
        width: 40,
        height: 40,
        display: "inline-block",
        marginRight: 10,
        cursor: "pointer",
      })}
      onMouseOver={() => setPackPreview(index)}
      onMouseOut={() => setPackPreview(-1)}
      onClick={() => {
        if (
          pkd >= packCosts[packPreview] &&
          packIndices[packPreview].some(
            (mon) => !monsKeys.has(`${mon[0]}-${mon[1]}`)
          )
        ) {
          const newPkd = pkd - packCosts[packPreview];
          setPkd(newPkd);
          set(ref(db, `${uid}/${PKD_KEY}`), newPkd);

          let newMonIndx = Math.floor(
            Math.random() * packIndices[packPreview].length
          );
          let newMon = packIndices[packPreview][newMonIndx];
          while (monsKeys.has(`${newMon[0]}-${newMon[1]}`)) {
            newMonIndx = Math.floor(
              Math.random() * packIndices[packPreview].length
            );
            newMon = packIndices[packPreview][newMonIndx];
          }

          set(ref(db, `${dbPath}/${newMon[0]}-${newMon[1]}`), true);
          setMonsData((monsData) => [...monsData, newMon]);
        }
      }}
    >
      <div
        className={cx({
          width: 40,
          height: 40,
          position: "absolute",
          opacity: 0.9,
          borderRadius: 8,
          filter: index == packPreview ? "blur(4px)" : "",
          transition: "filter 275ms ease",
          ...packDatum,
        })}
      />
      <div
        className={cx({
          background: `url(${pokepack}) -30px -30px`,
          backgroundSize: 100,
          width: 40,
          height: 40,
          position: "absolute",
          ...packDatum.imgStyles,
        })}
      />
    </div>
  ));

  const scale = 0.5;
  const previewMons =
    packPreview >= 0 &&
    packIndices[packPreview].map((mon) => (
      <div
        key={`${mon[0]}-${mon[1]}`}
        className={cx(styles.clip, {
          background: `url(${sprites}) ${-mon[0] * dimensions[0]}px ${
            -mon[1] * dimensions[1]
          }px`,
          width: dimensions[0],
          height: dimensions[1],
          transform: `scale(${scale})`,
          marginRight: `-40px`,
          marginTop: `-20px`,
          filter: monsKeys.has(`${mon[0]}-${mon[1]}`)
            ? ""
            : "brightness(0.0) blur(10px)",
          transition: "filter 275ms cubic-bezier(0.45, 0.083, .73, 0.13)",
        })}
      ></div>
    ));

  const packs = (
    <div>
      {pokePacks}
      <div
        className={cx({
          marginLeft: -30,
        })}
      >
        {previewMons}
      </div>
    </div>
  );

  return (
    <Spacing bottom={1.5}>
      <Spacing inner all={1}>
        <div className={cx({ height: dimensions[1] })}>
          {showPacks ? packs : mons}
        </div>
      </Spacing>
      <Spacing inline right={0.5}>
        <img className={cx(styles.pkd)} src={pokedollar} />
      </Spacing>
      <Text inline>
        {pkd}
        {pkd > 0 && ",000"}
        {packPreview >= 0 ? (
          <div
            className={cx({ color: "red", display: "inline" })}
          >{` (-${packCosts[packPreview]},000)`}</div>
        ) : (
          ""
        )}
      </Text>
    </Spacing>
  );
}

// MVP
// Task Points
// // Frequency tasks: count as subtasks until you've completed the last one of the arc
// // Repeat tasks: count as subtasks until you've completed them all
// // Requirement tasks: Once enough subtasks are complete, main task is automatically completed

// Other app features: spaced repetition
// markdown editor scratchpad

// Store pokemon and pkd in database [DONE]
// Just stick uid in local storage [DONE]
// Firebase security [DONE]
// Loading state [DONE]
// Breaks if you have 0 pokemon [DONE]
