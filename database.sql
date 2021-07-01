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

CREATE TABLE projects (
    project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    is_private BOOLEAN NOT NULL,
    header_img VARCHAR(300),
    project_owner uuid NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table projects add foreign key(project_owner) references users(user_id) on delete cascade;
-- test
--delete column 
-- alter table projects drop column columns;
alter table projects add columns json DEFAULT '[]'::json not null;
-- alter table projects add columns text[] DEFAULT '{}';

CREATE TABLE shared_users(
    shared_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    shared_user uuid NOT NULL,
    shared_project uuid NOT NULL,
    can_edit boolean NOT NULL DEFAULT false
);
alter table shared_users add foreign key(shared_user) references users(user_id) on delete cascade;
alter table shared_users add foreign key(shared_project) references projects(project_id) on delete cascade;


CREATE TABLE tasks (
    task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(55) NOT NULL,
    project uuid NOT NULL,
    markdown TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table tasks add foreign key(project) references projects(project_id) on delete cascade;


-- CREATE TABLE columns (
--     column_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     column_name VARCHAR(55) NOT NULL,
--     tasks TEXT[],
--     project uuid NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
-- alter table columns add foreign key(project) references projects(project_id) on delete cascade;

