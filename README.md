# 👋🏽 Welcome to Kallo

Kallo is an kanban based task manager application that allows you to organize any projects or tasks into b ards and todos. It's a customizable kanban board application that tells you whats being worked on, what's up next and what's completed.

## Tech Stack

- Next.js
- Node.js
- Express
- PostgreSQL
- TailwindCss
- Unsplash Api

Be sure to have Node.js and postgreSQL installed. For PostgreSQL, be sure to you are able to run:
`psql -U superuser` in your terminal because the application used psql in the terminal to access the database locally.

Head over to the [Unsplash Api website](https://unsplash.com/developers) and create an account and register as a developer ~ it's free.
After signup head over to `your apps` located on the header / navbar and create a new app. Read and accept the terms of agreement. Enter your project details and once you've created the app scroll all the way down to keys and copy and paste your `secret and access keys`. Your Unsplash Api keys will be used be stored in the .env.local file inside the client directory that we will make later.

## Features

- A beautifully designed kanban board focused on getting things done.
- You can create a project and include any picture using the Unsplash Api.
- Each project starts off with a kanban board which you can add your custom columns and cards to.
- Columns can be re-arranged to any order you like.
- Each card can be dragged and dropped into a column.
- Each card can have tags which can be set to specific colors.
- Each card is called a task and inside each task you can create your own todo list with subtasks.
- Dark and Light Theme Mode.

## Installation to run locally

Be sure to have Node.js and Postgresql installed before continuing.

Clone the project

```bash
  git clone https://github.com/lorenzejay/kallo.git
```

Go to the project directory

```bash
  cd kallo
```

## Start Node Server (Backend)

Install dependencies - You will need to also do this in the client directory

```bash
  npm install
```

Create a .env file

```bash
  touch .env
```

Inside your .env file include:

```
PORT = 5000
NODE_ENV = Development
<-------------Use your own PG_USER & PG_PASSWORD------------->
PG_USER = your_postgresql_username_here
PG_PASSWORD = your_postgresql_password
<-------------Use your own PG_USER & PG_PASSWORD------------->
PG_HOST = localhost
PG_PORT = 5432
PG_DATABASE = kallo
JWT_SECRET = jwt_secret_can_be_anything_you_want
```

Start the server - server will run on port 3000

```bash
  npm run start
```

## Start Next.js (Frontend)

Install dependencies - You will need to also do this in the client directory

```bash
  npm install
```

Create another .env

```bash
  touch .env.local
```

Inside your .env file include:

```
NODE_ENV = Development
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = your_access_key_here
UNPLASH_SECRET_KEY = your_secret_key_here
```

Start the server - Next.js will run on port 3000

```bash
  npm run dev
```

#### Future possibility are to run ends concurrently.
