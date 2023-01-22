# Angular Todo app
_Simple todo application, that is easy to understand and extend_

[![N|Solid](https://i.postimg.cc/DwtT0VJS/powered-by-Angular-CLI-logo.png)](https://github.com/angular/angular-cli)


## The application currently supports Angular 15.1.2 version

## Features
- A simple todo application, allowing to Create, Update, Delete and mark  Todo as completed 
- Works with the [JSON Server](https://github.com/typicode/json-server) to minimize the need of external API challanges
- Simply run the server and application and start experimenting with todos
- You can copy the Todo database and use it elsewere without a need for something unusual than just using the JSON file.

## What's in the box
Angular Todo uses **only** open source projects:
- [Angular CLI](https://github.com/angular/angular-cli/releases/tag/15.1.2) - **15.1.2**
- [Bootstap](https://github.com/twbs/bootstrap/releases/tag/v5.2.3) - **5.2.3**
- [Bootstrap Icons](https://icons.getbootstrap.com/icons/github/) - **1.10.3**

# Addtional specs

| Feature | Version |
| ------ | ------ |
| Typescript | [4.9.4](https://github.com/microsoft/TypeScript/releases/tag/v4.9.4) |
| Karma | [6.3.4](https://github.com/karma-runner/karma/releases/tag/v6.3.4) |
| Jasmin | [4.0.3](https://github.com/karma-runner/karma-jasmine/releases/tag/v4.0.1) |

> Note: project is configured to use [SASS](https://sass-lang.com/).
---

## Installation

Angular Todo requires [Node.js](https://nodejs.org/) latest to run, _but you can try your luck with previous versions_ )).

Install the dependencies and devDependencies and start the server.

```sh
cd angular-todo
npm i
node app
```

For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

## Development
### RUN
To run the application server:
```sh
npm run server
```
Then you can run the main application:
```sh
npm start
```
> Note: Application uses 4200 port as default. 
Want to change the port? 
Then go to `package.json` and change `ng serve --open` to `ng serve --port XXXX --open`

### BUILD
To build the application run:
```sh
ng build
```

### UNIT TESTS
To execute the unit tests run:
```sh
ng test
```

### END 2 END UNIT TESTS
To execute the end-to-end unit tests run:
```sh
ng e2e
```

---


## License
MIT

**Free Software, Hell Yeah!**
