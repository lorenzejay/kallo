create database custom_crm;

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
alter table projects add columns json DEFAULT '{}'::json;
-- alter table projects add columns text[] DEFAULT '{}';

-- CREATE TABLE columns (
--     column_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     column_name VARCHAR(55) NOT NULL,
--     tasks TEXT[],
--     project uuid NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
-- alter table columns add foreign key(project) references projects(project_id) on delete cascade;

