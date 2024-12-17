## API endpoints

### Authentication

- **api/register**

  - #### Method

    - POST

  - **Request Body:**

    - ```json
      {
        "email": "string",
        "username": "string",
        "password": "string"
      }
      ```

  - **Response Body**:

    ```json
    {
      "message": "User created successfully",
      "userId": "string"
    }
    ```

- **api/login**

  - #### Method

    - POST

  - **Request body:**

    - ```json
      {
        "email": "string",
        "password": "string"
      }
      ```

  - **Response Body**:

    - ```json
      {
        "tokenId": "string",
        "message": "User logged in successfully",
        "userId": "string"
      }
      ```

- **api/logout**

  - #### Method

    - GET

  - **Response Body**:

    - ```json
      {
        "message": "User logged in successfully"
      }
      ```

### Messages

- **api/sendMessage**

  - **Method**
    - POST
  - **Description** send message to the user

  - **Request body**

    - ```json
      {
        "senderId": "string",
        "receiverId": "string",
        "content": "string"
      }
      ```

  - **Response body**
    - ```json
      {
        "message": "message sent successfully"
      }
      ```

- **api/getUserMessages/:userId**

  - **Method**
    - GET
  - **Description**

    - To get user messages

  - **Request params**

    - ```json
      {
        "userId": "string"
      }
      ```

  - **Response body**
    - ```json
      {
        "message": "message displayed",
        "receivedMessage": {},
        "sentMessage": {}
      }
      ```

### Users

- **GET /api/users**

  - **Description**: Retrieve a list of all users.
  - **Response**:
    ```json
    [
      {
        "id": "string",
        "username": "string",
        "status": "online/offline"
      }
    ]
    ```

- **PUT /api/users/:id/status**

  - **Description**: Update a user's online/offline status.
  - **Request Body**:
    ```json
    {
      "status": "online/offline"
    }
    ```
