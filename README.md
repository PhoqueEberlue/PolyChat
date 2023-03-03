# PolyChat

School project implementing an instant messaging application with a backend database.

## Introduction

PolyChat uses NodeJS as a backend, VueJS for the frontend, MongoDB and Redis for the database.

The project structure follows this:

```
├── backend
│   ├── database         (SQL files from the past implementation)
│   └── src              NodeJs
│       └── database     Mongo / Redis controllers
│           └── models   Mongo Models
└── PolyChatClient       
    ├── dist             Miscellaneous
    │   └── assets
    ├── public
    └── src
        ├── assets       Images
        ├── components   Vue components
        │   └── icons
        ├── pages        Vue pages
        └── services     Socket.io
```

In order to run the projet you must first run MongoDB and Redis daemons.

Next add connection information in backend/database/credentials.json with this template:

```json
{
    "con_string": "mongodb:/",
    "database": "127.0.0.1:28200"
}
```

Then launch the backend:

```bash
cd backend/src
npm run install
npm run dev
```

Finally launch Vue for the frontend:

```bash
cd PolyChatClient/src
npm run install
npm run dev
```

## Organisation

- Front End, Mongo / Redis, Backend : Maxime
- Socket / Room, Backend : Andrew

## Architecture

[Architecture](architecture.png)

## Functionnalities

- Creating/Login a user account
- Creating a chat room and adding users to it
- Sending direct messages via sockets
- Storing messages into mongo
- Replicata set of the database
- Storing connections to chat rooms into Redis

## What we learnt

- Socket.io
- TypeScript
- VueJs
- Redis / Mongodb
