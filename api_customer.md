# EUROBUS CLIENT API Documentation

## Endpoints :

List of available endpoints:

- `POST /pub/register`
- `POST /pub/login`
- `POST /pub/google`

- `GET /pub/products`
- `GET /pub/products/:id`
- `GET /categories`

- `GET /pub/wishlist`
- `POST /pub/wishlist/:id`

&nbsp;

## 1. POST /pub/register

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "statusCode": 201,
  "message": "Account creation success",
  "data": {
    "id": "integer",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "statusCode": 400,
  "message": "Validation error: Email format is wrong"
}
OR
{
  "statusCode": 400,
  "message": "notNull Violation: Email cannot be empty"
}
OR
{
  "statusCode": 400,
  "message": "email must be unique"
}
OR
{
  "statusCode": 400,
  "message": "notNull Violation: Password cannot be empty"
}
```

&nbsp;

## 2. POST /pub/login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "statusCode": 200,
  "message": "Logged in successfully",
  "access_token": "string",
  "userdata": {
    "id": "integer",
    "role": "string",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "statusCode": 400,
  "message": "Username and Password cannot be empty"
}
```

_Response (401 - Unauthorized)_

```json
OR
{
  "statusCode": 401,
  "message": "Unauthorized: Invalid Email or Password"
}
```

&nbsp;

## 3. POST /pub/google

Description:

- Sign in using Google email and password

Request:

- headers:

```json
{
  "token_google": "string"
}
```

_Response (200 - OK)_

```json
{
  "statusCode": 200,
  "message": "Login success",
  "access_token": "string",
  "customerData": {
    "id": "integer",
    "email": "string"
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "statusCode": 401,
  "message": "Unauthorized: Invalid Email or Password"
}
```

&nbsp;

## 4. GET /pub/products

Description:

- Get all products from database

Request:

- query (optional):

```
https://eurobus-client.web.app/?page=value&category=value
```

where:

- page = indicates the current page being displayed. Automatically returns to last page if it exceeds the total number of pages.
- category = indicates the category ID being applied as a filter. Automatically ignored if no categories with given value exist or if filter doesn't being applied.

_Response (200 - OK)_

```json
{
    "statusCode": 200,
    "currentPage": "1",
    "totalPages": 17,
    "data": [
        {
            "id": 1,
            "name": "Quamba",
            "description": "luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse",
            "price": 2604035,
            "stock": 309,
            "imgUrl": "http://dummyimage.com/239x100.png/ff4444/ffffff",
            "categoryId": 5,
            "authorId": 2,
            "status": "Active",
            "createdAt": "2023-05-03T10:39:21.715Z",
            "updatedAt": "2023-05-03T10:39:21.715Z",
            "Category": {
                "id": 5,
                "name": "Chassis",
                "createdAt": "2023-05-03T10:39:21.329Z",
                "updatedAt": "2023-05-03T10:39:21.329Z"
            }
        },
        ...,
    ]
}

```

&nbsp;

## 5. GET /pub/products/:id

Description:

- Get a product by id from database

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "statusCode": 200,
  "data": {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date",
    "Category": {
      "id": "integer",
      "name": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  },
  "QRcode": "string"
}
```

_Response (404 - Not Found)_

```json
{
  "statusCode": 404,
  "message": "Error Not Found"
}
```

&nbsp;

## 6. GET /categories

Description:

- Get all categories from database

_Response (200 - OK)_

```json
{
    "statusCode": 200,
    "data": [
        {
            "id": 1,
            "name":"Double Decker Coach",
            "createdAt": "2023-04-15T12:22:35.674Z",
            "updatedAt": "2023-04-15T12:22:35.675Z"
        },
        {
            "id": 2,
            "name": "Single Decker Coach",
            "createdAt": "2023-04-15T12:22:48.381Z",
            "updatedAt": "2023-04-15T12:22:48.381Z"
        },
        ...,
    ]
}

```

&nbsp;

## 7. GET /pub/wishlist

Description:

- Get list of wishlist marked by customer

Request:

- headers:

```json
{
  "access_token": "string (required)"
}
```

_Response (200 - OK)_

```json
{
    "CustomerId": "integer",
    "ProductId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
    "data": [
          {
            "CustomerId": "integer",
            "ProductId": "integer",
            "createdAt": "date",
            "updatedAt": "date",
            "Product": {
                "id": "integer",
                "name": "string",
                "description": "string",
                "price": "integer",
                "stock": "integer",
                "imgUrl": "string",
                "categoryId": "integer",
                "authorId": "integer",
                "status": "string",
                "createdAt": "date",
                "updatedAt": "date"
            }
          },
        ...,
    ]
}

```

&nbsp;

## 8. POST /pub/wishlist/:id

Description:

- Add a product into wishlist by id

Request:

- headers:

```json
{
  "access_token": "string (required)"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (201 - CREATED)_

```json
{
  "statusCode": 201,
  "message": "Wishlist created",
  "data": {
    "customerId": "integer",
    "productId": "integer"
  }
}
```

_Response (404 - Not Found)_

```json
{
  "statusCode": 404,
  "message": "No such product exists"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "statusCode": 401,
  "message": "Authentication failed"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
