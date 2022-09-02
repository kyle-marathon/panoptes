export type Item = {
  title: string;
  id: string;
  times?: number;
  completed: number;
  frequency?: number;
  required?: number;
  subtasks?: Subtask[];
  lastCompleted?: Date[];
};

export type Subtask = {
  title: string;
  id: string;
  completed: number;
};

export type Items = Item[];
