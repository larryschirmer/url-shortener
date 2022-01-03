# URL SHORTENER API

The REST API for the URL Shortener application.

## About

Returns a JSON object with details about the app including:

    - Author Name
    - Description
    - Version Number
    - Release Notes

### Request

`GET /slug/isValid?slug=slugName`

    curl -X GET 'http://localhost:1337/about'

### Response

    {
        "name": "URL Shortener",
        "description": "A URL shortener built with Node.js and Express.js",
        "author": "Larry Schirmer",
        "license": "MIT",
        "version": "1.0.X",
        "releaseNotes": "Add new endpoint"
    }

## Redirect

Redirects user to the corresponding URL if the slug is found.

### Request

`GET /:slug`

    curl -X GET 'http://localhost:1337/:slug'

## Login

There are two types of users in this application:

- Admin users:
  - Can create/edit/delete short URLs
  - Can use ETL endpoints
  - Can create "Listed" URLs (i.e. URLs that are shows to non-logged in users)
- Guest users:
  - Can create/edit/delete short URLs
  - Cannot use ETL endpoints
  - Cannot create "Listed" URLs

For non-logged in users, the home page will show a list of all "Listed" URLs. These will belong to any of the admin users. If a user is logged in, they will see a list of only the links they have created.

### Request

`POST /auth`

    curl -X POST 'http://localhost:1337/auth' \
        -H 'Content-Type: application/json' \
        -d '{"name": "admin", "password": "password"}'

### Response

    {
        "token": jwt-token
    }

## Get User

Authenticated users can get their own information.

### Request

`GET /auth`

    curl -X GET 'http://localhost:1337/auth' \
        -H 'Authorization: Bearer jwt-token'

### Response

    {
        "name": "admin",
        "isAdmin": true,
        "favorites": []
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

    [
        {
            "_id": "61be2b2e003d33d6c33f5f8b",
            "name": "Youtube #social #video #educational #fun",
            "slug": "youtube",
            "url": "https://youtube.com",
            "isListed": true,
            "tags": [ "#social", "#video", "#educational", "#fun" ],
            "opens": []
        }
    ]

#### Logged in user (Admin or Guest)

Returns all links that belong to the logged in user.

    curl -X GET 'http://localhost:1337/slug' \
        -H 'Authorization: Bearer jwt-token'

### Response

    [
        {
            "_id": "61be2b22003d33d6c33f5f86",
            "name": "Unnamed",
            "slug": "k9eke",
            "url": "https://google.com",
            "isListed": false,
            "tags": [],
            "opens": []
        },
        {
            "_id": "61be2b2e003d33d6c33f5f8b",
            "name": "Youtube #social #video #educational #fun",
            "slug": "youtube",
            "url": "https://youtube.com",
            "isListed": true,
            "tags": [ "#social", "#video", "#educational", "#fun" ],
            "opens": []
        }
    ]

## Prevalidate Slug

Utility endpoint to check if a slug is available. Returns true if available, false if not.

### Request

`GET /slug/isValid?slug=slugName`

    curl -X GET 'http://localhost:1337/slug/isValid?slug=slugName'

### Response

    {
        "isValid": true
    }

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

    {
        "_id": "61be680a1150adad81d7d9af",
        "name": "Youtube #social #video #educational #fun",
        "slug": "youtube",
        "url": "https://youtube.com",
        "isListed": false,
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

    {
        "_id": "61be680a1150adad81d7d9af",
        "name": "Youtube #social #video #fun!",
        "slug": "youtube",
        "url": "https://youtube.com",
        "isListed": false,
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

    { "success": true }

## Add Favorite

Uses the `linkId` param to add a link to a user's favorites.

### Request

`PUT /user/favorite/:linkId`

    curl -X PUT 'http://localhost:1337/user/favorite/:linkId' \
        -H 'Authorization: Bearer jwt-token'

### Response

    {
        "name": "admin",
        "isAdmin": true,
        "favorites": ["61be2b2e003d33d6c33f5f8b"]
    }

## Delete Favorite

Uses the `linkId` param to remove a link from a user's favorites.

### Request

`PUT /user/favorite/:linkId`

    curl -X DELETE 'http://localhost:1337/user/favorite/:linkId' \
        -H 'Authorization: Bearer jwt-token'

### Response

    {
        "name": "admin",
        "isAdmin": true,
        "favorites": []
    }

## Create User (Admin)

Creates a new user with the specified name and password. This endpoint is only accessible by admin users.

### Request

`POST /etl/createUser`

    curl -X POST 'http://localhost:1337/etl/createUser' \
        -H 'Authorization: Bearer jwt-token' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "user",
            "password": "abc123",
            "isAdmin": false
        }'

### Response

    { "success": true }

## Append User to Links (Admin)

**Deprecated** This endpoint is no longer used. The purpose of this endpoint was to allow users to be added to links that were created before the multi-user feature was implemented.

### Request

`POST /etl/addUserToLinks`

    curl -X POST 'http://localhost:1337/etl/addUserToLinks' \
        -H 'Authorization: Bearer jwt-token' \
        -H 'Content-Type: application/json' \
        -d '{
            "userId": "61b9127b4f2cca57a204ac56"
        }'

### Response

    { "success": true }
