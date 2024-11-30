## Schema

##### User

| Field Name | Data Type | Description                |
| ---------- | --------- | -------------------------- |
| id         | String    | Unique id for each user    |
| username   | String    | user's name                |
| password   | String    | encrypted user's password  |
| status     | String    | online or offline status   |
| createdAt  | Datetime  | Account creation timestamp |

#### Message Collection

| Field Name | Data type | Description                       |
| ---------- | --------- | --------------------------------- |
| id         | String    | unique id for messages            |
| sendrId    | String    | sender' unique id                 |
| receiverId | String    | receiving user's id               |
| content    | string    | content of the message            |
| timestamp  | Datetime  | when the message was sent         |
| read       | boolean   | whether the message has been read |
