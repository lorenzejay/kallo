export type Todo = {
  todo_id: string;
  description: string;
  task_id: string;
  is_checked: boolean;
  parent_todo: string | null;
};

//each individual item inside the kanban board
export type Task = {
  task_id: string;
  title: string;
  column_id: string;
  index: number;
};

//
export type Column = {
  column_id: string;
  name: string;
  index: number;
  project_associated: string;
};
export type BoardColumn = {
  column_id: string;
  column_title: string;
  index: number;
  tasks: Task[]
};

export type ProjectsNew = {
  project_id: string;
  title: string;
  is_private: boolean;
  created_at: string;
  header_img: string;
  project_owner: string;
};

export type BoardColumns = {
  column_id: string;
  column_title: string;
  column_index: number;
  tasks: Task[];
};

export type FormResultType = {
  success: boolean;
  message: string;
};
export type SharedUsers = {
  shared_user: string;
  status: Status;
  shared_id: string;
};
export interface Projects {
  columns: Column[];
  created_at: string;
  header_img: string;
  is_private: boolean;
  project_id: string;
  project_owner: string;
  title: string;
}

export interface ProjectDeets {
  project_id: string;
  header_img: string;
  project_owner: string;
  created_at: string;
  is_private: boolean;
  title: string;
  // boardColumns: BoardColumns[] | undefined;
}

export interface TagsType {
  tag_id: string;
  title: string;
  task_id: string;
  hex_color: string;
  index: number;
  created_at: string;
}

export interface ReturnedApiStatus {
  success: boolean;
  message: string;
}

export interface UserProjectAccess {
  access: boolean;
  adminStatus: boolean;
  editingStatus: boolean;
}

export enum Status {
  owner = "owner",
  admin = "admin",
  viewer = "viewer",
  editor = "editor",
  none = "none"
}
export interface ColumnsWithTasksType {
  column_id: string,
  name: string,
  index: number,
  project_associated: string,
  tasks: Task[],
}