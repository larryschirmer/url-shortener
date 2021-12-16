# URL Shortener

This is the backend for the Lnk Shrtnr application. Built with:

- Node.js
- Express.js
- MongoDB
- Monk
- JWT tokens

## Features

  - [x] Create a new short URL
  - [x] View a short URL details
  - [x] Redirect to a short URL
  - [x] View all short URLs details
  - [x] Delete a short URL
  - [x] Login as an admin
  - [ ] Login as a guest
  - [ ] Validate that a slug is not in use

## Usage

- [Postman Collection](https://raw.githubusercontent.com/larryschirmer/url-shortener/main/docs/Url%20Shortener.postman_collection.json)

## Installation

- Clone the repository
- Add ignored env file
  - `.devcontainer/devcontainer.env`
  - Add the following to the file:
    - `MASTER_USER=`
    - `MASTER_PASSWORD=`
- Launch the dev container using vscode
  - This will place the env vars in the PATH
- Install using npm
  - `npm install`

This application expects to find a running mongo database running at 27017. I use a docker container for that but its not picky.