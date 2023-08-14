# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/)

## Downloading

```
git clone https://github.com/i-bayanov/nodejs2023Q2-service.git
```

## Installing NPM modules

```
npm install
```

## Configuring environment

Create `env` file with environment variables.
For your convenience, the file `.env.example` is attached, containing a list of required variables and their approximate values.

## Running application

```
docker compose up -d --build
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

The application is launched in development mode.
You can make changes to the code, the application will automatically restart.
For example, you can navigate to `http://localhost:4000/` in your browser and see the welcome message.
This message can be changed in the `src/app.service.ts` file.
A new message will be displayed each time the changes are made and the browser page is reloaded.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
