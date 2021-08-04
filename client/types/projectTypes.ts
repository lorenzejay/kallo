export type Markdown = {
  id: string;
  html: string;
  tag: string;
};

export type Tags = {
  labelName: string;
  labelColor: string;
};

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
export type Columns = {
  column_id: string;
  name: string;
  index: number;
  project_associated: string;
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
  user_id: string;
  username: string;
};
export interface Projects {
  columns: Columns[];
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
  project_title: string;
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
