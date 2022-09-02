export const MOCK_CONFIG = {
  startDate: new Date("Thu Sep 1 2022 "),

  endDate: new Date("Tue Sep 21 2022"),
};

export const MOCK_ITEMS = [
  {
    completed: 0,
    title: "Solve fusion",
    id: "dnd-2",
    subtasks: [
      {
        title: "Commercialize MFP",
        id: "dnd-2-0",
        completed: 0,
      },
      {
        title: "Enrich lithium",
        id: "dnd-2-1",
        completed: 0,
      },
    ],
  },
  {
    completed: 1,
    lastCompleted: [
      new Date("Mon Aug 27 2022 14:57:00 GMT-0400 (Eastern Daylight Time)"),
      new Date("Mon Aug 29 2022 14:57:00 GMT-0400 (Eastern Daylight Time)"),
    ],
    title: "Play Chess",
    id: "dnd-0",
    frequency: 2,
  },
  {
    completed: 3,
    title: "Lift heavy weights",
    id: "dnd-3",
    times: 5,
  },
  {
    completed: 0,
    title: "Learn Japanese Grammar, Vocabulary and Pronunciation",
    id: "dnd-1",
  },
  {
    completed: 0,
    title: "Read books",
    id: "dnd-4",
    required: 2,
    subtasks: [
      {
        title: "Convinience Store Woman",
        id: "dnd-4-0",
        completed: 1,
      },
      {
        title: "The Golden Compass",
        id: "dnd-4-1",
        completed: 0,
      },
      {
        title: "The Subtle Knife",
        id: "dnd-4-2",
        completed: 0,
      },
    ],
  },
];
