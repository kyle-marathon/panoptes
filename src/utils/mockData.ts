import { Items } from "./types";

export const MOCK_CONFIG = {
  startDate: new Date("Thu Sep 1 2022 "),

  endDate: new Date("Tue Sep 21 2022"),
};

export const MOCK_ITEMS: {
  [key: string]: { [key: string]: any; tasks: Items };
} = {
  FhIIpYHfumVyad0TJ67rSh0ZOMJ3: {
    hasItems: true,
    lastId: 25,
    mons: {
      "1-1": true,
      "10-16": true,
      "2-2": true,
      "2-5": true,
      "2-6": true,
    },
    pkd: 14,
    tasks: {
      "task-11": {
        completed: 0,
        id: "task-11",
        index: 0,
        title: "Learn Japanese",
      },
      "task-14": {
        completed: 3,
        id: "task-14",
        index: 4,
        lastCompleted: [
          "2022-09-06T00:47:04.406Z",
          "2022-09-06T00:48:06.047Z",
          "2022-09-06T01:45:36.367Z",
        ],
        times: 9,
        title: "Lift weights",
      },
      "task-15": {
        completed: 4,
        id: "task-15",
        index: 3,
        lastCompleted: [
          "2022-09-03T02:38:19.684Z",
          "2022-09-03T02:38:19.857Z",
          "2022-09-03T02:38:20.010Z",
          "2022-09-06T00:29:36.122Z",
        ],
        times: 6,
        title: "Run",
      },
      "task-16": {
        completed: 0,
        id: "task-16",
        index: 5,
        required: 2,
        subtasks: {
          "task-16-2": {
            completed: 0,
            id: "task-16-2",
            title: "The Subtle Knife",
          },
          "task-16-3": {
            completed: 0,
            id: "task-16-3",
            title: "Convenience Store Woman",
          },
          "task-16-4": {
            completed: 0,
            id: "task-16-4",
            title: "The Golden Compass",
          },
        },
        title: "Read books",
      },
      "task-17": {
        completed: 1,
        frequency: 3,
        id: "task-17",
        index: 2,
        lastCompleted: ["2022-09-05T22:47:55.347Z"],
        title: "Clean bathroom",
      },
      "task-23": {
        collapsed: false,
        completed: 0,
        hideToolbar: false,
        id: "task-23",
        index: -1,
        title:
          "<h3>Priorities for the week</h3><ul><li>Establish a comfortable work environment</li><li>Enjoy healthy meals</li><li>Get restful sleep</li></ul>",
        type: "Editor",
      },
    },
  },
};
