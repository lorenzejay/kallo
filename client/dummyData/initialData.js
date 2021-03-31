import { v4 as uuid } from "uuid";
export const intialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Take out the garbage" },
    "task-2": { id: "task-2", content: "Go for a run" },
    "task-3": { id: "task-3", content: "Take kids to school play" },
    "task-4": { id: "task-4", content: "Cook dinner" },
  },
  columns: {
    "column-1": {
      id: 1,
      title: "to do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },
  // allowa reordering of the columns
  columnOrder: ["column-1"],
};

export const dummyTasks = [
  { id: uuid(), content: "Take out the garbage" },
  { id: uuid(), content: "Go for a run" },
  { id: uuid(), content: "Take kids to school play" },
  { id: uuid(), content: "Cook dinner" },
  { id: uuid(), content: "second to last" },
  { id: uuid(), content: "Last todo" },
];
export const initalData2 = {
  // tasks: {
  //   1: { id: 1, content: "Take out the garbage" },
  //   2: { id: 2, content: "Go for a run" },
  //   3: { id: 3, content: "Take kids to school play" },
  //   4: { id: 4, content: "Cook dinner" },
  //   5: { id: 5, content: "second to last" },
  //   6: { id: 6, content: "Last todo" },
  // },
  columns: {
    ["random-string1"]: {
      id: "random-string1",
      title: "To Do",
      // taskIds: [1, 2, 3],
      taskIds: [dummyTasks[0], dummyTasks[1], dummyTasks[2], dummyTasks[3]],
    },
    ["random-string2"]: {
      id: "random-string2",
      title: "In Progress",
      // taskIds: [5, 6],
      taskIds: [dummyTasks[4], dummyTasks[5]],
    },
    ["random-string3"]: {
      id: "random-string3",
      title: "Completed",
      taskIds: [],
    },
  },
  // allowa reordering of the columns
  columnOrder: ["random-string1", "random-string2", "random-string3"],
};

const dummyItems = [
  { id: uuid(), content: "First Task" },
  { id: uuid(), content: "Second Task" },
  { id: uuid(), content: "Third Task" },
  { id: uuid(), content: "Fourth Task" },
];
export const dummyColumns = {
  [uuid()]: {
    name: "Todo",
    items: dummyItems,
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Completed",
    items: [],
  },
};

export const dummyItemsInArrayFormat = [
  {
    id: uuid(),
    name: "Todo",
    items: dummyItems,
  },
  {
    id: uuid(),
    name: "In Progress",
    items: [],
  },
  {
    id: uuid(),
    name: "Completed",
    items: [],
  },
  {
    id: uuid(),
    name: "extra",
    items: [],
  },
];

// export const initialTasks = [
//   { id: 1, content: "Take out the garbage" },
//   { id: 2, content: "Go for a run" },
//   { id: 3, content: "Take kids to school play" },
//   { id: 4, content: "Cook dinner" },
//   { id: 5, content: "Next" },
//   { id: 6, content: "Last todo" },
// ];

// export const initalColumns = [{ columnId: 1, title: "To Do", taskIds: [1, 2, 3, 4] }];
// export const columnOrder = [1];
