# PolyChat

School project implementing an instant messaging application with a backend database.

## Introduction

PolyChat uses NodeJS as a backend, VueJS for the frontend and MySQL.

The project structure follows this:

```
├── backend
│   ├── database -> MySQL source scripts
│   └── main.js
│   └── src
│       └── database -> JS DB controller
└── PolyChatClient
    ├── public
    └── src
        ├── main.js 
        ├── assets
        ├── components -> Vue components
        │   └── icons
        └── pages -> Views
```

In order to run the projet you must first setup a mysql database using the creation script in
/backend/database/init_script.sql

You may also want to create a new user with permissions to acces the database

```sql
CREATE USER username IDENTIFIED BY password
GRANT ALL PRIVILEGES TO username;
```

Next add connection information in backend/database/credentials.json with this template:

```json
{
"host": "x.x.x.x",
"user": "username",
"password": "password"
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
