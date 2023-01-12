# Angular TODO application
The latest supported version is Angular 12.
TODO: need upgrade ))

###  Spec:
What is included:
* Modular angular code that talks to a RESTful API endpoints.
* TS code unit tests
* SASS stylings with an example of proper usage of SASS variables
* Bootstrap 5 styles
* A todo list single page application.
* Add/Edit/Delete todo items
* Mark todo item as done
* Ability to filter items in the todo list with choosing the filter type

### Server
The server runs under JSON server with the following endpoints:
GET  from http://localhost:3000/tasks ← list all todo items                 
GET /1 ← view detail of a specific todo item, where id = 1                  
POST ← creates a new todo item (as long as it has an available id)                 
PATCH /1 ← edits the todo item with id = 1             
DELETE /1 ← deletes the todo item, with id = 1               

### Quick start
#### clone the repo
Go to your developer folder
Clone this project repository to your local machine

#### change into the repo directory
`cd main`

#### install
`npm install`

#### serve
`npm run server`                   
`npm run start`

#### Running unit tests
`npm run test`

