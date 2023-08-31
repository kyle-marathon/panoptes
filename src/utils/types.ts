export type Cards = {
  [cardId: string]: {
    front: string;
    back: string;
    linkedId: string;
    viewed: number;
    lastViewed?: string;
  };
};

export type TableData = {
  [key: number]: TableDataRow;
};

export type TableDataRow = {
  rowId: number;
  data: { [key: string]: string };
};

export type Content = string | TableData;

export type Item = {
  title: string;
  id: string;
  completed: number;
  index: number;
  type?: string;
  times?: number;
  frequency?: number;
  required?: number;
  subtasks?: Subtasks;
  lastCompleted?: (Date | string)[];
  collapsed?: boolean;
  hideToolbar?: boolean;
};

export type Items = { [key: string]: Item };

export type Subtask = {
  title: Content;
  id: string;
  completed: number;
  collapsed?: boolean;
  hideToolbar?: boolean;
  type?: string;
};

export type Subtasks = { [key: string]: Subtask };

export enum Types {
  Task = "Task",
  Editor = "Editor",
}

export type UpdateData = { [key: string]: any };
