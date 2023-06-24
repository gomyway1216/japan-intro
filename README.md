# Task Manager Client

This client is responsible for connecting to the server to fetch and display task data. It also interacts with the server allowing users to create their own tasks.

## Authentication & Authorization
Authentication and authorization are handled through Google Firebase, which is responsible for user creation and returns a `userId`. The server uses this `userId` as a primary key to store records in the database.

## Primary Goals
The primary goals of this application include:

- Enabling users to easily create tasks and associate them with other tasks through parent-child relationships, grouping by tags, and due dates.
- Allowing users to organize what needs to be done for each task.
- Providing a user-friendly interface to view the list of tasks and trace their status (ongoing, to-do, and complete).
- Enabling users to identify trends in the types of tasks they perform.
- Providing analysis and insights into user activities.
- Enhancing user satisfaction through the sense of accomplishment provided by completing tasks.
- Offering suggestions for future work through Chat GPT.

## Code Structure
### `/api`
This folder contains classes that connect to the server. The `tag.ts` file is responsible for CRUD operations related to tags. The `task.ts` file handles CRUD operations related to tasks.

### `/components` 
This directory contains reusable components that are not unique to each page.

### `/constants`
This directory hosts a list of constant values used throughout the application.

### `/pages`
This directory contains components for each page that the user can view. These components are divided into subfolders based on functionality and are grouped with the components specific to each page.

### `/provider`
This directory contains data used across the client-side application, including authentication data and tasks that are used across multiple pages.


## Development Tracker
### tag
#### Complete
CRUD operations in tag.ts

#### TO DO
create tagList class that connects to tag.ts and enable the user to create edit, and view the Tags


### task
#### Complete
CRUD operations in task.ts

#### TO DO
create taskList class that connects to tag.ts and enable the user to create edit, and view the Tags.
Create mobile view.
Create the view for desktop. But this one is lower priority.