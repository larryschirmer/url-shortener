# URL SHORTENER API

The REST API for the URL Shortener application.

### Overview:

- Admin:
  - GET /admin/createUser - Create a new user
- API Info:
  - GET /about - Get information about the API
- Link CRUD:
  - GET /slug - Get all links
  - POST /slug - Create a new link
  - PUT /slug/:id - Update a link
  - DELETE /slug/:id - Delete a link
  - PUT /slug/favorite/:id - Favorite a link
- Link Requests:
  - GET /slugName - Request to be redirected to a link
  - GET /slug/isValid?slug=slugName - Check if a link slug is currently in use
- User Authentication:
  - POST /auth - Login as a user
  - GET /auth - Return user info cooresponding to the token

### Private Routes:

Private routes are only accessible with a valid token. Tokens are generated using the GET /auth route and included in the request header. To access a private route, include the token in the request header as an Authorization Bearer token.

- GET /admin/createUser - Create a new user
- POST /slug - Create a new link
- PUT /slug/:id - Update a link
- DELETE /slug/:id - Delete a link
- PUT /slug/favorite/:id - Favorite a link
- GET /auth - Return user info cooresponding to the token

## Create User (Admin)

Creates a new user with the specified name and password. This endpoint is only accessible by admin users.

### Request

`POST /admin/createUser`

    curl -X POST 'http://localhost:1337/admin/createUser' \
        -H 'Authorization: Bearer jwt-token' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "user",
            "password": "abc123",
            "isAdmin": false
        }'

### Response

Headers:

    { "token": jwt-token }

Body:

    { "success": true }

## About

Returns a JSON object with details about the app including:

    - Author Name
    - Description
    - Version Number
    - Release Notes

### Request

`GET /slug/about`

    curl -X GET 'http://localhost:1337/about'

### Response

Body:

    {
        "name": "URL Shortener",
        "description": "A URL shortener built with Node.js and Express.js",
        "author": "Larry Schirmer",
        "license": "MIT",
        "version": "1.0.X",
        "releaseNotes": "Add new endpoint"
    }

## Get All Links

Returns all links.

- For non-logged in users, only returns "Listed" links
- For users (Admin or Guest), returns all links that belong to the user

### Request

`GET /slug`

#### Non-logged in user

Returns all links that are "Listed". These links belong to any of the admin users.

    curl -X GET 'http://localhost:1337/slug'

### Response

Body:

    [
        {
            "_id": "61be2b2e003d33d6c33f5f8b",
            "name": "Youtube #social #video #educational #fun",
            "slug": "youtube",
            "url": "https://youtube.com",
            "isListed": true,
            "isFavorite": false,
            "tags": [ "#social", "#video", "#educational", "#fun" ],
            "opens": []
        }
    ]

#### Logged in user (Admin or Guest)

Returns all links that belong to the logged in user.

    curl -X GET 'http://localhost:1337/slug' \
        -H 'Authorization: Bearer jwt-token'

### Response

Headers:

    { "token": jwt-token }

Body:

    [
        {
            "_id": "61be2b22003d33d6c33f5f86",
            "name": "Unnamed",
            "slug": "k9eke",
            "url": "https://google.com",
            "isListed": false,
            "isFavorite": false,
            "tags": [],
            "opens": []
        },
        {
            "_id": "61be2b2e003d33d6c33f5f8b",
            "name": "Youtube #social #video #educational #fun",
            "slug": "youtube",
            "url": "https://youtube.com",
            "isListed": true,
            "isFavorite": false,
            "tags": [ "#social", "#video", "#educational", "#fun" ],
            "opens": []
        }
    ]

## Create Link

Creates a new link. `url` is a required field, all others are optional.

### Request

`POST /slug`

    curl -X POST 'http://localhost:1337/slug' \
        -H 'Authorization: Bearer jwt-token' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "Youtube #social #video #educational #fun",
            "slug": "youtube",
            "url": "https://youtube.com",
            "isListed": false
        }'

### Response

Headers:

    { "token": jwt-token }

Body:

    {
        "_id": "61be680a1150adad81d7d9af",
        "name": "Youtube #social #video #educational #fun",
        "slug": "youtube",
        "url": "https://youtube.com",
        "isListed": false,
        "isFavorite": false,
        "tags": [ "#social", "#video", "#educational", "#fun" ],
        "opens": []
    }

## Update Link

Uses the `linkId` param to select a link to update. All fields are optional. Any fields that are not specified will not be updated.

### Request

`PUT /slug/:linkId`

    curl -X PUT 'http://localhost:1337/slug/:linkId' \
        -H 'Authorization: Bearer jwt-token' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "Youtube #social #video #fun!"
        }'

### Response

Headers:

    { "token": jwt-token }

Body:

    {
        "_id": "61be680a1150adad81d7d9af",
        "name": "Youtube #social #video #fun!",
        "slug": "youtube",
        "url": "https://youtube.com",
        "isListed": false,
        "isFavorite": false,
        "tags": [ "#social", "#video", "#fun!" ],
        "opens": []
    }

## Delete Link

Uses the `linkId` param to select a link to delete.

### Request

`DELETE /slug/:linkId`

    curl -X DELETE 'http://localhost:1337/slug/:linkId' \
        -H 'Authorization: Bearer jwt-token'

### Response

Headers:

    { "token": jwt-token }

Body:

    { "success": true }

## Set Favorite

Uses the `linkId` param to mark a link as favorite. Links can only be favorited by the user that created them.

### Request

`PUT /slug/favorite/:linkId`

    curl -X PUT 'http://localhost:1337/slug/favorite/:linkId' \
        -H 'Authorization: Bearer jwt-token'
        -H 'Content-Type: application/json' \
        -d '{
            "isFavorite": true
        }'

### Response

Headers:

    { "token": jwt-token }

Body:

    {
        "_id": "61be680a1150adad81d7d9af",
        "name": "Youtube #social #video #fun!",
        "slug": "youtube",
        "url": "https://youtube.com",
        "isListed": false,
        "isFavorite": true,
        "tags": [ "#social", "#video", "#fun!" ],
        "opens": []
    }

## Redirect

Redirects user to the corresponding URL if the slug is found.

### Request

`GET /:slug`

    curl -X GET 'http://localhost:1337/:slug'

## Prevalidate Slug

Utility endpoint to check if a slug is available. Returns true if available, false if not.

### Request

`GET /slug/isValid?slug=slugName`

    curl -X GET 'http://localhost:1337/slug/isValid?slug=slugName'

### Response

Body:

    { "isValid": true }

## Login

There are two types of users in this application:

- Admin users:
  - Can create/edit/delete short URLs
  - Can use Admin endpoints
  - Can create "Listed" URLs (i.e. URLs that are shows to non-logged in users)
- Guest users:
  - Can create/edit/delete short URLs
  - Cannot use Admin endpoints
  - Cannot create "Listed" URLs

For non-logged in users, the home page will show a list of all "Listed" URLs. These will belong to any of the admin users. If a user is logged in, they will see a list of only the links they have created.

### Request

`POST /auth`

    curl -X POST 'http://localhost:1337/auth' \
        -H 'Content-Type: application/json' \
        -d '{"name": "admin", "password": "password"}'

### Response

Headers:

    { "token": jwt-token }

Body:

    { "success": true }

## Get User

Authenticated users can get their own information.

### Request

`GET /auth`

    curl -X GET 'http://localhost:1337/auth' \
        -H 'Authorization: Bearer jwt-token'

### Response

Headers:

    { "token": jwt-token }

Body:

    {
        "name": "admin",
        "isAdmin": true,
    }
