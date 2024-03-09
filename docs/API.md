## API Documentation

### 1. `GET /`

- **Description**: Check if the server is running.
- **Request Method**: `GET`
- **Response**:
  - Status Code: `200 OK`
  - Body: `"Connection Established"`

---

### 2. `GET /get_user_info`

- **Description**: Get user information if authenticated.
- **Request Method**: `GET`
- **Headers**:
  - `Authorization`: Bearer token
- **Response**:
  - Status Code: `200 OK`
  - Body: 
    ```json
    {
        "username": "username",
        "email": "email"
    }
    ```
- **Error Responses**:
  - Status Code: `401 Unauthorized`
    ```json
    {
        "error": "Unauthorized No Token"
    }
    ```
  - Status Code: `404 Not Found`
    ```json
    {
        "error": "User not found"
    }
    ```

---

### 3. `GET /getArchivedImages`

- **Description**: Get a user's private images from the database.
- **Request Method**: `GET`
- **Headers**:
  - `Authorization`: Bearer token
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "Got Public Images",
        "images": []
    }
    ```
- **Error Responses**:
  - Status Code: `401 Unauthorized`
    ```json
    {
        "error": "Unauthorized No Token"
    }
    ```
  - Status Code: `404 Not Found`
    ```json
    {
        "error": "User not found"
    }
    ```

---

### 4. `PUT /toggleImagePrivacy/<image_id>`

- **Description**: Toggle an image's privacy status.
- **Request Method**: `PUT`
- **URL Parameters**:
  - `image_id`: The ID of the image to toggle privacy.
- **Headers**:
  - `Authorization`: Bearer token
- **Request Body**:
  ```json
  {
    "isPublic": true
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "Privacy status of image <image_id> updated successfully",
        "public": true
    }
    ```
- **Error Responses**:
  - Status Code: `401 Unauthorized`
    ```json
    {
        "error": "Unauthorized No Token"
    }
    ```
  - Status Code: `404 Not Found`
    ```json
    {
        "error": "Image not found"
    }
    ```

---

### 5. `GET /getImages`

- **Description**: Get public images.
- **Request Method**: `GET`
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "Got Public Images",
        "images": []
    }
    ```

---

### 6. `POST /signup`

- **Description**: Sign up a new user.
- **Request Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "username",
    "password": "password",
    "email": "email"
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "response": "Signed Up Successful",
        "token": "JWT_token"
    }
    ```
- **Error Responses**:
  - Status Code: `400 Bad Request`
    ```json
    {
        "response": "Username already exists!"
    }
    ```

---

### 7. `POST /signout`

- **Description**: Sign out a user.
- **Request Method**: `POST`
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "response": "Signed Out Successful"
    }
    ```

---

### 8. `POST /login`

- **Description**: Login a user.
- **Request Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "response": "Login Successful",
        "token": "JWT_token"
    }
    ```
- **Error Responses**:
  - Status Code: `401 Unauthorized`
    ```json
    {
        "response": "Invalid username or password"
    }
    ```

---

### 9. `POST /imageTotext`

- **Description**: Convert an image to text using BLIP model.
- **Request Method**: `POST`
- **Request Body**:
  - `caption`: Caption for the image (optional)
  - `file`: Image file
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "File uploaded successfully",
        "caption": "image_caption"
    }
    ```
- **Error Responses**:
  - Status Code: `500 Internal Server Error`
    ```json
    {
        "error": "error_message"
    }
    ```

---

### 10. `POST /generateLLM`

- **Description**: Generate a funny caption using LLM model.
- **Request Method**: `POST`
- **Request Body**:
  - `captionGenerated`: Caption generated from BLIP model
  - `tone`: Tone for the caption
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "File uploaded successfully",
        "result": "funny_caption"
    }
    ```
- **Error Responses**:
  - Status Code: `500 Internal Server Error`
    ```json
    {
        "error": "error_message"
    }
    ```

---

### 11. `POST /generate`

- **Description**: Generate an image based on a prompt using the Stable Diffusion model.
- **Request Method**: `POST`
- **Request Body**:
  - `prompt`: Prompt for image generation
  - `model`: Model type (`runwayml/stable-diffusion-v1-5` for base model, other for detailed model)
  - `guidance`: Guidance for image generation
  - `inferenceSteps`: Inference steps for image generation
- **Response**:
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "File uploaded successfully",
        "prompt": "prompt",
        "images": [{"image_data": "base64_encoded_image"}]
    }
    ```
- **Error Responses**:
  - Status Code: `500 Internal Server Error`
    ```json
    {
        "error": "error_message"
    }
    ```

---

### 12. `POST /editImage`

- **Description:** Edit an image based on a prompt using the Stable Diffusion model.
- **Request Body:** Image file and prompt
- **Request Body**:
  - `prompt`: Prompt for image generation
  - `image`: Image requested to be edited 

- **Response**: Success message with edited image
  - Status Code: `200 OK`
  - Body:
    ```json
    {
        "message": "File uploaded successfully",
        "prompt": "prompt",
        "images": [{"image_data": "base64_encoded_image"}]
    }
    ```
- **Status Codes:** 
  - `200 OK` if successful
  - `500 Internal Server Error` if an error occurs

---