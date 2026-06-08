# Assignment-4: Personal To-Do Manager with Authentication.
Assignment-4 from Pocket School for Profession Back-End software development program.

### TASK:
A simple REST API built with Node.js and Express.js that allows users to register, log in, and manage their personal to-do lists using JWT authentication. All data is stored in JSON files, so no database is required.

---

## Features

### Authentication

* User Registration (Signup)
* User Login (Signin)
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes Middleware
* User Profile Endpoint
* User Logout

### To-Do Management

* Add New To-Do
* Get All To-Dos of Logged-In User
* Delete Own To-Do
* User-specific data isolation

### Additional Features

* Passwords stored securely using bcrypt hashes
* JWT-based authentication
* Timestamp added to every to-do item
* JSON files used as a mock database

---

## Technologies Used

* Node.js
* Express.js
* bcrypt
* jsonwebtoken (JWT)
* dotenv
* fs (File System Module)

---

## Project Structure

```text
project/
│
├── assets/
│   ├── users.json
│   └── todos.json
│
├── controllers/
│   ├── authControllers.js
│   └── todoControllers.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
│
├── utils/
│   ├── logger.js
│   └── todoLogger.js
│
├── .env
├── app.js
├── package.json
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/shahjalalhazari/PS-Assignment-4-Personal-To-Do-Manager-with-Authentication
cd PS-Assignment-4-Personal-To-Do-Manager-with-Authentication
```

### Install dependencies

```bash
npm install
```

### Create a .env file

```env
PORT=5000
JWT_SECRET=create_your_own_secret_key
```

### Start the server

```bash
npm start
```

---

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/signup
```

Request Body:

```json
{
  "username": "testuser",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User created successfully."
}
```

---

#### Login User

```http
POST /auth/signin
```

Request Body:

```json
{
  "username": "testuser",
  "password": "password123"
}
```
create your own user by giving above mentioned data fields.

Response:

```json
{
  "message": "Signin successful.",
  "token": "jwt_token_here"
}
```

##### COPY THE TOKEN

---

#### Get User Profile

```http
GET /auth/profile
```

Headers:

```http
Authorization: Bearer <token>
```

Response:

```json
{
  "userId": "123456",
  "username": "testuser"
}
```

---

#### Logout User

```http
POST /auth/logout
```

Headers:

```http
Authorization: Bearer <token>
```

Response:

```json
{
  "message": "Logout successful."
}
```

Note:
Since JWT authentication is stateless, logout should be handled by removing the token from the client.

---

## To-Do Endpoints

### Add To-Do

```http
POST /api/todo/add-todo    
```

Headers:

```http
Authorization: Bearer <token>
```

Request Body:

```json
{
  "text": "Learn Express.js"
}
```

Response:

```json
{
  "message": "Todo created successfully."
}
```

---

### Get Current User To-Dos

```http
GET /api/todo
```

Headers:

```http
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "id": "1749820000000",
    "userId": "123456",
    "text": "Learn Express.js",
    "createdAt": "2026-06-08T10:00:00.000Z"
  }
]
```

---

### Delete To-Do

```http
DELETE /api/todo/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Response:

```json
{
  "message": "Todo deleted successfully."
}
```

Only the owner of the to-do can delete it.

---

## Sample users.json

```json
[
  {
    "id": "u123",
    "username": "testuser",
    "password": "$2b$10$hashedPasswordHere"
  }
]
```

---

## Sample todos.json

```json
[
  {
    "id": "t1",
    "userId": "u123",
    "text": "Learn Node.js",
    "createdAt": "2025-06-21T10:00:00Z"
  }
]
```

---

## Testing

You can test the API using:

* Thunder Client
* Postman

### Authentication Header Example

```http
Authorization: Bearer your_jwt_token_here
```

---

## Security Features

* Passwords are hashed using bcrypt.
* JWT protects private routes.
* Users can only access their own to-do items.
* Users can only delete their own to-do items.

---

## Author

Shahjalal Hazari

##### localhost post is 3000

## Thank You
