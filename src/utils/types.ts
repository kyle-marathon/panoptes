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
  title: string;
  id: string;
  completed: number;
};

export type Subtasks = { [key: string]: Subtask };

export enum Types {
  Task = "Task",
  Editor = "Editor",
}
