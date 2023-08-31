export default function Spaced() {
  return <div>settings</div>;
}

// import { useState, useEffect } from "react";
// import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

// import { set, update, get, ref, remove } from "firebase/database";
// import { db } from "../setup/setupFirebase";

// import {
//   useRecoilValue,
//   useRecoilState,
//   selector,
//   useSetRecoilState,
// } from "recoil";
// import {
//   uidState,
//   lastIdState,
//   showPacksState,
//   hasItemsState,
//   itemsState,
// } from "../atoms";
// import { Items, Cards } from "../utils/types";

// import LunarInput from "@airbnb/lunar/lib/components/Input";
// import IconButton from "@airbnb/lunar/lib/components/IconButton";
// import Spacing from "@airbnb/lunar/lib/components/Spacing";
// import Divider from "@airbnb/lunar/lib/components/Divider";
// import Text from "@airbnb/lunar/lib/components/Text";
// import Title from "@airbnb/lunar/lib/components/Title";
// import Button from "@airbnb/lunar/lib/components/Button";
// import Dropdown from "@airbnb/lunar/lib/components/Dropdown";

// import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
// import IconCreate from "@airbnb/lunar-icons/lib/interface/IconCreate";

// import Card from "./Card";
// import Input from "./Input";
// import Autocomplete from "./Autocomplete";

// const removeTags = (s: string) => s.replace(/<\/?[^>]+(>|$)/g, "");
// const levenshteinDistance = (str1 = "", str2 = "") => {
//   const track = Array(str2.length + 1)
//     .fill(null)
//     .map(() => Array(str1.length + 1).fill(null));
//   for (let i = 0; i <= str1.length; i += 1) {
//     track[0][i] = i;
//   }
//   for (let j = 0; j <= str2.length; j += 1) {
//     track[j][0] = j;
//   }
//   for (let j = 1; j <= str2.length; j += 1) {
//     for (let i = 1; i <= str1.length; i += 1) {
//       const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
//       track[j][i] = Math.min(
//         track[j][i - 1] + 1, // deletion
//         track[j - 1][i] + 1, // insertion
//         track[j - 1][i - 1] + indicator // substitution
//       );
//     }
//   }
//   return track[str2.length][str1.length];
// };

// const editDistance = (s1: string, s2: string) =>
//   levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());

// export const appStyleSheet: StyleSheet = ({ color, ui, unit }) => ({
//   input_wrap: {
//     "@selectors": {
//       "> section > div > div > div > input": {
//         borderWidth: 1,
//       },
//       "> section > div > label": {
//         marginBottom: unit / 2,
//       },
//     },
//   },
//   spaced: {
//     display: "flex",
//     flexDirection: "column",
//     overflow: "auto",
//     "@selectors": {
//       "::-webkit-scrollbar": {
//         display: "none",
//       },
//       "> div:last-child": {
//         // flex: "1 1 1px",
//         // overflow: "auto",
//       },
//       "> div:last-child > div": {
//         height: "100%",
//       },
//       "> div:last-child > div > div": {
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       },
//       "> div:last-child > div > div > div:last-child": {
//         overflow: "auto",
//       },
//     },
//   },
//   cardList: {
//     flex: "1 1 200px",
//     "@selectors": {
//       "::-webkit-scrollbar": {
//         display: "none",
//       },
//     },
//   },
//   header: {
//     background: color.accent.bgHover,
//     padding: `${unit}px ${2 * unit}px ${unit}px ${2 * unit}px`,
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   card: {
//     background: color.accent.bgHover,
//     borderRadius: ui.borderRadius - 1,
//   },
// });

// type SpacedProps = {
//   loading: boolean;
// };

// export default function Spaced({ loading }: SpacedProps) {
//   const [styles, cx] = useStyles(appStyleSheet);
//   const [front, setFront] = useState("");
//   const [back, setBack] = useState("");
//   const [linkedValue, setLinkedValue] = useState("");
//   const [linkedTaskId, setLinkedTaskId] = useState("");
//   const [selecting, setSelecting] = useState(false);
//   const items = useRecoilValue<Items>(itemsState);
//   const [collapsed, setCollapsed] = useState(false);
//   const [cards, setCards] = useState<Cards>({});
//   const [guess, setGuess] = useState("");
//   const uid = useRecoilValue(uidState);

//   const dbPath = `${uid}/cards`;

//   useEffect(() => {
//     if (!loading) {
//       get(ref(db, dbPath)).then((snapshot) => {
//         if (snapshot.exists()) {
//           setCards(snapshot.val());
//         }
//       });
//     }
//   }, [loading]);

//   const cardValues = Object.values(cards);
//   const numCards = cardValues.length;

//   const activeCard =
//     Object.values(items).length <= 0
//       ? undefined
//       : Object.entries(cards).find(
//           ([key, { lastViewed, linkedId, viewed }]) => {
//             if (lastViewed == undefined) {
//               return true;
//             }

//             const { completed } = items[linkedId];
//             let interval = 1;
//             if (completed >= 5 && viewed >= 18) {
//               interval = 60;
//             } else if (completed >= 3 && viewed >= 14) {
//               interval = 16;
//             } else if (completed >= 1 && viewed >= 7) {
//               interval = 5;
//             }

//             const newDate = new Date(lastViewed);
//             newDate.setDate(newDate.getDate() + interval);

//             return newDate < new Date();
//           }
//         );

//   const autocompleteItems = Object.values(items).map((item) => ({
//     value: removeTags(item.title),
//     id: item.id,
//   }));

//   const autocompleteOptions = new Set(
//     autocompleteItems.map((item) => item.value)
//   );

//   const cardList = Object.entries(cards).map(([cardId, card], idx) => {
//     const linkedItem =
//       items != undefined && items[card.linkedId]
//         ? items[card.linkedId].title
//         : "";

//     return (
//       <Spacing horizontal={2} vertical={2} key={idx}>
//         <Card overflow noShadow>
//           <div className={cx(styles.card)}>
//             <Spacing inner horizontal={1.5} vertical={1.5}>
//               <Spacing bottom={1}>
//                 <div
//                   className={cx({
//                     display: "flex",
//                     justifyContent: "space-between",
//                   })}
//                 >
//                   <Text bold>{card.front}...</Text>
//                   <div>
//                     {/* <Spacing inline right={0.5}>
//                       <IconButton onClick={() => {}}>
//                         <IconCreate decorative size="0.887em" />
//                       </IconButton>
//                     </Spacing> */}
//                     <IconButton
//                       onClick={() => {
//                         const {
//                           [cardId]: { ...oldCard },
//                           ...newCards
//                         } = cards;
//                         setCards(newCards);
//                         set(ref(db, `${dbPath}/${cardId}`), null);
//                       }}
//                     >
//                       <IconClose decorative size="0.887em" />
//                     </IconButton>
//                   </div>
//                 </div>
//                 <Text>{card.back}</Text>
//               </Spacing>
//               <Text muted small>
//                 linked to {removeTags(linkedItem)}
//               </Text>
//             </Spacing>
//           </div>
//         </Card>
//       </Spacing>
//     );
//   });

//   const newCard = (
//     <Card overflow noShadow>
//       <div className={cx(styles.card)}>
//         <Spacing inner horizontal={1.5} vertical={1.5}>
//           <Text bold>New Card</Text>
//           <Spacing top={2}>
//             <Input small label="Front" value={front} onChange={setFront} />
//           </Spacing>
//           <Spacing top={1}>
//             <Input small label="Back" value={back} onChange={setBack} />
//           </Spacing>
//           <Spacing top={1} bottom={2.5}>
//             <Autocomplete
//               small
//               loadItemsOnFocus
//               selectUnknownOnEnter={false}
//               invalid={
//                 !selecting &&
//                 linkedValue.length > 0 &&
//                 !autocompleteOptions.has(linkedValue)
//               }
//               accessibilityLabel="Linked item"
//               label="Linked item"
//               name="autocomplete"
//               placeholder=""
//               onChange={(value) => {
//                 setLinkedValue(value);
//                 if (!selecting) {
//                   setSelecting(true);
//                 }
//               }}
//               onSelectItem={(item, value) => {
//                 setSelecting(false);
//                 if (value?.id && typeof value.id == "string") {
//                   setLinkedTaskId(value.id);
//                 }
//               }}
//               onBlur={() => {
//                 setSelecting(false);
//               }}
//               onFocus={() => setLinkedValue("")}
//               onLoadItems={(value) => {
//                 if (linkedValue.length == 0) {
//                   return Promise.resolve(
//                     autocompleteItems.filter((item) => true)
//                   );
//                 } else {
//                   return Promise.resolve(
//                     autocompleteItems.filter((item) =>
//                       item.value.toLowerCase().match(value.toLowerCase())
//                     )
//                   );
//                 }
//               }}
//             />
//           </Spacing>
//           <Button
//             small
//             inverted
//             onClick={() => {
//               const newCard = {
//                 front: front,
//                 back: back,
//                 linkedId: linkedTaskId,
//                 viewed: 0,
//               };

//               const newId =
//                 numCards > 0
//                   ? `card-${
//                       Math.max(
//                         ...Object.keys(cards!).map((key) =>
//                           parseInt(key.split("-").slice(-1)[0])
//                         )
//                       ) + 1
//                     }`
//                   : `card-0`;

//               setCards((cards) => ({
//                 ...cards,
//                 [newId]: newCard,
//               }));

//               setFront("");
//               setBack("");

//               set(ref(db, `${dbPath}/${newId}`), newCard);
//               set(ref(db, `${dbPath}/${newId}`), newCard);
//             }}
//           >
//             Add
//           </Button>
//         </Spacing>
//       </div>
//     </Card>
//   );

//   const handleKeyDown = (e: any) => {
//     const { key } = e;
//     if (key == "Enter" && activeCard != undefined) {
//       if (editDistance(activeCard[1].back, guess) <= 5) {
//         const newDate = new Date();
//         const newCard = {
//           ...activeCard[1],
//           lastViewed: newDate.toDateString(),
//           viewed: activeCard[1].viewed + 1,
//         };

//         setCards({
//           ...cards,
//           [activeCard[0]]: newCard,
//         });
//         setGuess("");

//         set(ref(db, `${dbPath}/${activeCard[0]}`), newCard);
//       }
//     }
//   };

//   const cardStackInner =
//     activeCard != undefined ? (
//       <>
//         <Text bold>{activeCard[1].front}...</Text>
//         <Spacing top={1}>
//           <div className={cx(styles.input_wrap)}>
//             <LunarInput
//               small
//               autoFocus
//               label="Back"
//               value={guess}
//               onChange={setGuess}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//         </Spacing>
//       </>
//     ) : (
//       <Text bold>You've completed all cards</Text>
//     );

//   const cardStack = (
//     <Card overflow noShadow>
//       <div className={cx(styles.card)}>
//         <Spacing inner horizontal={1.5} vertical={1.5}>
//           {cardStackInner}
//         </Spacing>
//       </div>
//     </Card>
//   );

//   return (
//     <div className={cx(styles.spaced)}>
//       <Spacing bottom={2}>{cardStack}</Spacing>
//       <Spacing bottom={2}>{newCard}</Spacing>
//       <div
//         className={cx(
//           !collapsed && {
//             flex: "1 1 1px",
//           }
//         )}
//       >
//         <Card noShadow>
//           <div>
//             <div className={cx(styles.header)}>
//               <Text bold large>
//                 Card list
//               </Text>
//               <Button
//                 small
//                 inverted
//                 onClick={() => {
//                   setCollapsed(!collapsed);
//                 }}
//               >
//                 <Spacing horizontal={2}>
//                   {collapsed ? "Reveal" : "Hide"}
//                 </Spacing>
//               </Button>
//             </div>
//             {!collapsed && (
//               <>
//                 <Divider bottom={0} top={0} />
//                 <div className={cx(styles.cardList)}>{cardList}</div>
//               </>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // Cards can be edited
// // - Populate new card fields
// // - Keep track of id of card
// // Cards can be deleted [DONE]
// // When a task is deleted, delete linked cards
// // Design nits
// // - Card list limited height if not populated

// // Done

// // To create new cards, you select a task to link it to
// // Write a prompt
// // Write a response
// // Hit create

// // There's an option to view all cards

// // Some stack of cards
// // Each card has some prompt on the front
// // And an input field
// // Check if input is correct or almost correct
// // Card flips over, you see the answer
// // You hit "next card"
// // Go through the whole stack

// // Cards appear every day
// // Cards get less frequent as you complete the associated task
// // It just checks how many completions the task has
// // Eh but should also be a function of how many times you've seen the card
// // Every day, then if you've completed it and seen it 7 times
// // Go to every 5 days
// // If you've completed it 3 times and seen it 14 times
// // Go to every 16 days
// // If you've completed it 5 times and seen it 18 times
// // Go to every 60 days
// // [1, 5, 16, 35]

// // So cards have:
// // cardId: {
// //   linkedTaskID: string;
// //   views: number;
// //   front: string;
// //   back: string;
// // }

// // Have to check that the relevant task still exists
// // Completed is fine, but it has to exist
// // Linked by ID is reliable
