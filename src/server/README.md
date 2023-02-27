![Server stack](https://github.com/dziana-babrova/rs-clone/raw/develop/src/server/logo.png)

# Just golf clone server

 API for 'Mini Golf' game ('RS Clone' task)

##  Setup and Running

- Clone this repo: `$ https://github.com/dziana-babrova/rs-clone.git`.

- Go to downloaded folder: `$ cd rs-clone`.

- Install dependencies: `$ npm install`.

- Start server: `$ npm run start-server`.

- Now you can send requests to the address (port can be set via environment variables): `http://127.0.0.1:3000`.

##  Usage

 **Auth**

- [Sign Up](https://github.com/dziana-babrova/rs-clone/server#sing-up)

- [Sign In](https://github.com/dziana-babrova/rs-clone/server#sing-in)

- [Sign Out](https://github.com/dziana-babrova/rs-clone/server#sing-out)

- [Refresh](https://github.com/dziana-babrova/rs-clone/server#refresh)

 **Maps**

- [Get Maps](https://github.com/dziana-babrova/rs-clone/server#get-maps)

- [Update Maps](https://github.com/dziana-babrova/rs-clone/server#update-maps)

- [Create Maps](https://github.com/dziana-babrova/rs-clone/server#create-maps)

 **Winners**

- [Get Maps](https://github.com/dziana-babrova/rs-clone/server#get-winners)



<a name="sign-up"></a>**Sign Up**

----

Returns json data with two JWT tokens (access and refresh) and UserDto instanse.

<details>

* **URL**

/api/auth/signup

* **Method:**

`POST`

* **Headers:**

`'Content-Type': 'application/json'`

* **URL Params**

None

* **Query Params**

None

* **Data Params**
```json
{

"email": "test@test.test",

"username": "testname",

"password": "password"

}
```


* **Success Response:**

* **Code:** 201 CREATED <br />

**Content:**

```json

{

"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc2MDUyNjAyfQ.kb4wpgExz4uH0BueM9L32VCVD5Qn6uv95I_pc2o_5Fc",

"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc4NTU4MjAyfQ.0YJVkhfkO26xw-g-vEbV6TDIam5SYq9_20Xd1nX-P70",

"user": {

    "id": "63e536fa90a6254a174ba0f3",

    "email": "test@test.test",

    "username": "tester"

}

}

```

* **Error Response:**

* **Code:** 400 BAD REQUEST <br />

**Content:**
``` json

{

"message": "User with this email already exists."

}

```
* **Code:** 400 BAD REQUEST <br />

**Content:**
``` json

{

"message": "Validation error",

"errors": [

  {

   "value": "te11st@test",

   "msg": "Email must match the pattern",

   "param": "email",

   "location": "body"

  },

  {

  "value": "",

   "msg": "Username should not be empty",

   "param": "username",

   "location": "body"

  },

  {

"value": "",

   "msg": "Password should not be empty",

   "param": "password",

   "location": "body"

  }

]

}

```

* **Notes:**

None

</details>

<a name="sign-in"></a>**Sign In**

----

Returns json data with two JWT tokens (access and refresh) and UserDto instanse.

<details>

* **URL**

/api/auth

* **Method:**

`POST`

* **Headers:**

`'Content-Type': 'application/json'`

* **URL Params**

None

* **Query Params**

None

* **Data Params**

```json

{

"email": "test@test.test",
"password": "password"
 
}


```

* **Success Response:**

* **Code:** 200 OK <br />

**Content:**

```json

{

"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc2MDUyNjAyfQ.kb4wpgExz4uH0BueM9L32VCVD5Qn6uv95I_pc2o_5Fc",

"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc4NTU4MjAyfQ.0YJVkhfkO26xw-g-vEbV6TDIam5SYq9_20Xd1nX-P70",

"user": {

    "id": "63e536fa90a6254a174ba0f3",

    "email": "test@test.test",

    "username": "tester"

}

}

```


* **Error Response:**

*  **Code:** 400 BAD REQUEST <br />

**Content:**
``` json

{

"message": "Wrong password"

}

```
* **Code:** 400 BAD REQUEST <br />

**Content:**
``` json

{

"message": "Validation error",

"errors": [

  {

   "value": "te11st@test",

   "msg": "Email must match the pattern",

   "param": "email",

   "location": "body"

  },

  {

  "value": "",

   "msg": "Username should not be empty",

   "param": "username",

   "location": "body"

  },

  {

"value": "",

   "msg": "Password should not be empty",

   "param": "password",

   "location": "body"

  }

]

}

```

* **Code:** 404 NOT FOUND <br />

**Content:**

```json

{

"message": "User test@test.test not found."

}

```

* **Notes:**

None

</details>

<a name="sign-out"></a>**Sing Out**

----

Logout of the user account.

<details>

* **URL**

/api/auth/signout

* **Method:**

`GET`

* **Headers:**

None

* **URL Params**

None

* **Query Params**

None

* **Data Params**

None

* **Cookies**

`refreshToken: 'user-token' (http only, automaticly set into cookies after login)`


* **Success Response:**

* **Code:** 200 OK<br />

**Content:**

```json
{}
```

* **Error Response:**

* **Code:** 400 BAD REQUEST <br />

**Content:**
``` json

{

"message": "Validation error",

"errors": [

  {

    "msg": "RefreshToken cookie required.",

    "param": "refreshToken",

    "location": "cookies"

  }

]

}

```


* **Notes:**

None

</details>

<a name="refresh"></a>**Refresh**

----

Refresh JWT tokens.

<details>

* **URL**

/api/auth/refresh

* **Method:**

`GET`

* **Headers:**

None

* **URL Params**

None

* **Query Params**

None

* **Data Params**

None

* **Cookies**

`refreshToken: 'user-token' (http only, automaticly set into cookies after login)`

* **Success Response:**

* **Code:** 200 OK <br />

**Content:**

```json

{

"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc2MDUyNjAyfQ.kb4wpgExz4uH0BueM9L32VCVD5Qn6uv95I_pc2o_5Fc",

"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTUzNmZhOTBhNjI1NGExNzRiYTBmMyIsImVtYWlsIjoidGUxMXMxdEB0ZXN0LnRlc3QiLCJ1c2VybmFtZSI6InRlc3RlciIsImlhdCI6MTY3NTk2NjIwMiwiZXhwIjoxNjc4NTU4MjAyfQ.0YJVkhfkO26xw-g-vEbV6TDIam5SYq9_20Xd1nX-P70",

"user": {

    "id": "63e536fa90a6254a174ba0f3",

    "email": "test@test.test",

    "username": "tester"

}

}

```

* **Error Response:**

* **Code:** 401 # UNAUTHORIZED <br />

**Content:**

```json

{

"message": "Unauthorized"

}

```

* **Notes:**

None

</details>

<a name="get-maps"></a>**Get Maps**

----

Returns json data with user maps card object.

<details>

* **URL**

/api/maps/

* **Method:**

`GET`

* **Headers:**

`'Authorization': 'Bearer ${accessToken}'`

* **URL Params**

None

* **Query Params**

None

* **Data Params**

None


* **Success Response:**

* **Code:** 200 OK <br />

**Content:**

```json

{
  "maps": [

  {
    "id": 1,

    "isUnlock": true,

    "stars": 0

  },

  {
    "id": 2,

    "isUnlock": true,

    "stars": 3

  },

  {
    "id": 3,

    "isUnlock": false,

    "stars": 0

  }

  ]
}
```

* **Error Response:**

* **Code:** 401 # UNAUTHORIZED <br />

**Content:**

```json

{

"message": "Unauthorized"

}

```

* **Code:** 404 NOT FOUND <br />

**Content:**

```json

{

"message": "Maps for user ${userId} not found."

}
```

* **Notes:**

None

</details>



<a name="update-maps"></a>**Update Maps**

----

Update maps instance.

<details>

* **URL**

/api/maps/

* **Method:**

`PUT`

* **Headers:**

`'Authorization': 'Bearer ${accessToken}'`

* **URL Params**

None

* **Query Params**

None

* **Data Params**

```json

{
  "maps": [

  {
    "id": 1,

    "isUnlock": true,

    "stars": 0

  },

  {
    "id": 2,

    "isUnlock": true,

    "stars": 3

  },

  {
    "id": 3,

    "isUnlock": false,

    "stars": 0

  }

  ]
}
```


* **Success Response:**

* **Code:** 204 OK <br />

**Content:**

```json

{}
```

* **Error Response:**

* **Code:** 401 # UNAUTHORIZED <br />

**Content:**

```json

{

"message": "Unauthorized"

}

```

* **Notes:**

None

</details>

<a name="update-maps"></a>**Create Maps**

----

Create maps instance.

<details>

* **URL**

/api/maps/

* **Method:**

`POST`

* **Headers:**

`'Authorization': 'Bearer ${accessToken}'`

* **URL Params**

None

* **Query Params**

None

* **Data Params**

```json

{
  "maps": [

  {
    "id": 1,

    "isUnlock": true,

    "stars": 0

  },

  {
    "id": 2,

    "isUnlock": true,

    "stars": 3

  },

  {
    "id": 3,

    "isUnlock": false,

    "stars": 0

  }

  ]
}
```


* **Success Response:**

* **Code:** 201 CREATED <br />

**Content:**

```json

{}
```

* **Error Response:**

* **Code:** 401 # UNAUTHORIZED <br />

**Content:**

```json

{

"message": "Unauthorized"

}

```

* **Code:** 400 # BAD REQUEST <br />

**Content:**

```json

{

"message": "Maps for this user already exists."

}

```

* **Notes:**

None

</details>

<a name="get-winners"></a>**Get Winners**

----

Return winners.

<details>

* **URL**

/api/winners/

* **Method:**

`GET`

* **Headers:**

None

* **URL Params**

None

* **Query Params**

None

* **Data Params**

None

* **Success Response:**

* **Code:** 200 OK <br />

**Content:**

```json

[
    {
        "username": "tester",
        "stars": 15
    },
    {
        "username": "tester",
        "stars": 15
    },
    {
        "username": "tester",
        "stars": 15
    },
    {
        "username": "tester",
        "stars": 15
    },
    {
        "username": "tester",
        "stars": 10
    },
    {
        "username": "tester",
        "stars": 10
    },
    {
        "username": "tester",
        "stars": 10
    },
    {
        "username": "tester",
        "stars": 10
    },
    {
        "username": "tester",
        "stars": 10
    },
    {
        "username": "tester",
        "stars": 10
    }
]
```

* **Error Response:**

* **Code:** 404 # NOT FOUND <br />

**Content:**

```json

{

"message": "Winners is empty."

}

```

* **Notes:**

None

</details>


