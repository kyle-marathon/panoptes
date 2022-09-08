export type Item = {
  title: string;
  id: string;
  completed: number;
  index: number;
  times?: number;
  frequency?: number;
  required?: number;
  subtasks?: Subtasks;
  lastCompleted?: Date[];
};

export type Items = { [key: string]: Item };

export type Subtask = {
  title: string;
  id: string;
  completed: number;
};

export type Subtasks = { [key: string]: Subtask };
