## API endpoints

### Authentication

- **POST api/signup**

  - **Request Body:**

    - ```json
      {
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

- **POST api/login**

  - **Request body:**

    - ```json
      {
        "username": "string",
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

### Messages

- **POST api/messages**

  - **Description:** send message from one user to another
  - **Request body:**

    - ```json
      {
        "senderId": "string",
        "receiverId": "string",
        "content": "string"
      }
      ```

  - **Response body:**
    - ```json
      {
        "message": "message sent successfully"
      }
      ```

- **GET /api/messages?senderId=xyz&receiverId=abc**
  - **Description:** Retrieve the chat history between two users.
  - **Response:**
    - ```json
      [
        {
          "id": "string",
          "senderId": "string",
          "receiverId": "string",
          "content": "string",
          "timestamp": "datetime",
          "read": false
        }
      ]
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
