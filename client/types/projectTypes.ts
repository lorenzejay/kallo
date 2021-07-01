export type Markdown = {
  id: string;
  html: string;
  tag: string;
};

export type Tags = {
  labelName: string;
  labelColor: string;
};
//each individual item inside the kanban board
export type Task = {
  id: string;
  content: string;
  tags: Tags[];
  markdown: Markdown[];
};

//
export type Columns = {
  id: string;
  name: string;
  items: Task[];
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
