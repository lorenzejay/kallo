create database kallo;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(55) NOT NULL,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TYPE status AS ENUM ('viewer', 'admin', 'editor');
CREATE TABLE projects (
    project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    is_private BOOLEAN NOT NULL,
    header_img TEXT DEFAULT NULL,
    project_owner uuid NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table projects add foreign key(project_owner) references users(user_id) on delete cascade;

CREATE TABLE shared_users(
    shared_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    shared_user uuid NOT NULL,
    shared_project uuid NOT NULL,
    status status
);
alter table shared_users add foreign key(shared_user) references users(user_id) on delete cascade;
alter table shared_users add foreign key(shared_project) references projects(project_id) on delete cascade;



CREATE TABLE columns (
  	column_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  	name text not null,
  	project_associated uuid not null,
  	index int not null
 );
alter table columns add foreign key(project_associated) references projects(project_id) on delete cascade;

CREATE TABLE tasks (
	task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  	title text NOT NULL,
  	column_id uuid NOT NULL,
  	index int NOT NULL
);
alter table tasks add foreign key(column_id) references columns(column_id) on delete cascade;

CREATE TABLE todos (
	todo_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  	description text not null,
  	task_id uuid not null,
  	is_checked boolean not null default false,
  	parent_todo uuid,
    index int not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table todos add foreign key(task_id) references tasks(task_id) on delete cascade;
alter table todos add foreign key(parent_todo) references todos(todo_id) on delete cascade;

CREATE table tags (
    tag_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
    title VARCHAR(55) NOT NULL,
    task_id uuid NOT NULL,
    hex_color VARCHAR(255) DEFAULT '#ffffff',
    index int not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table tags add foreign key(task_id) references tasks(task_id) on delete cascade;