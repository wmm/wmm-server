# Where's my money? - Reborn

A new version for a collage project, with the aim of tracking loans between friends and colleagues.

## Setup
You will need NPM and Node.Js for running the API and a MySQL database.

### Database
You can setup the database with [this SQL script](scripts/db.sql).

### Configuration files
Configure [src/config/db.json](src/config/db.json) for the DB connection and [src/config/jwt.json](src/config/jwt.json) for token generation settings.

### Starting the API
First install the packages with `npm install`, then start the server with `npm start`.

## Documentation
All routes are documented [here](docs/).

## Platforms

### Server-side

Backend will be developed and supported for Linux OS running Node.JS

### Client-side

Primary focus on mobile development (Flutter)