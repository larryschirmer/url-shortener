# URL Shortener

This is the backend for the Lnk Shrtnr application. Built with:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT tokens

## Features

- [x] Create a new short URL
- [x] View a short URL details
- [x] Redirect to a short URL
- [x] View all short URLs details
- [x] Delete a short URL
- [x] Login as an admin
- [x] Login as a guest
- [x] Validate that a slug is not in use

## Usage

- [Postman Collection](https://raw.githubusercontent.com/larryschirmer/url-shortener/main/docs/Url%20Shortener.postman_collection.json)
  - This collection has an embedded environment variable to make it easier to test the API. You can use the `{{local_admin}}` variable by adding it after testing the login endpoint. [Postman Docs - Variables](https://learning.postman.com/docs/sending-requests/variables/)
- [API Docs](https://github.com/larryschirmer/url-shortener/tree/main/docs)

## Installation

- Clone the repository
- Add ignored env file
  - `.devcontainer/devcontainer.env`
  - Add the following to the file:
    - `TOKEN_SECRET=jwt-signing-secret`
  - This is only for local development, in production set env var to something more cryptic
- Launch the dev container using vscode
  - This will place the env var in the PATH
- Install using npm
  - `npm install`

This application expects to find a running mongo database running at 27017. I use a docker container for that but its not picky.

## Populating the database

Before running the application, you need to populate the database with an intial user. Creating additional users is supported via an ETL endpoint, but this requires that the request be sent with a valid admin jwt token.

- Add admin user to database manually
  - build project `npm run build`
  - run `node ./docs/hashPassword.js password`
  - copy output to clipboard and use in next step
  - connect to mongo db cli
  - add user
    - `use urlShortener`
    - `db.users.insertOne({name: 'admin', password: 'copy clipboard', isAdmin: true})`
