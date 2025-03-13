# Profile API with Mongoose

This project is a RESTful API that manages user profiles using Express.js and MongoDB with Mongoose.

## Requirements

- Node.js (>= 14.x)
- Docker and Docker Compose

## Installation

1. Get the project:

```
git clone https://github.com/yourusername/mongoose-project.git
cd mongoose-project
```

2. Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://root:example@localhost:27017/profile-api?authSource=admin
PORT=3000
```

3. Start the project:

```
docker compose up
```

### To stop the application:

```
docker compose down
```


## API Endpoints

### Profiles

- **GET /profiles** - Get all profiles

  - Query parameters:
    - `skill` - Filter by skill
    - `location` - Filter by location
    - `search` - Search in name, email, and bio

- **GET /profiles/:id** - Get a single profile by ID

- **POST /profiles** - Create a new profile

  - Request body:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
    ```

- **PUT /profiles/:id** - Update a profile

  - Request body:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
    ```

- **DELETE /profiles/:id** - Soft-delete a profile

### Profile Experience

- **POST /profiles/:id/experience** - Add experience to a profile

  - Request body:
    ```json
    {
      "title": "Software Developer",
      "company": "Tech Co",
      "dates": "2020-2023",
      "description": "Full-stack development"
    }
    ```

- **DELETE /profiles/:id/experience/:exp** - Delete an experience

### Profile Skills

- **POST /profiles/:id/skills** - Add a skill to a profile

  - Request body:
    ```json
    {
      "skill": "JavaScript"
    }
    ```

- **DELETE /profiles/:id/skills/:skill** - Delete a skill

### Profile Information

- **PUT /profiles/:id/information** - Update profile information
  - Request body:
    ```json
    {
      "bio": "Full-stack developer",
      "location": "Paris, France",
      "website": "https://johndoe.com"
    }
    ```

## Testing with Postman


### Create a Profile

- **Method**: POST
- **URL**: `http://localhost:3000/profiles`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Add Experience

- **Method**: POST
- **URL**: `http://localhost:3000/profiles/{profile_id}/experience`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "title": "Software Developer",
  "company": "Tech Co",
  "dates": "2020-2023",
  "description": "Full-stack development"
}
```

### Add Skill

- **Method**: POST
- **URL**: `http://localhost:3000/profiles/{profile_id}/skills`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "skill": "JavaScript"
}
```

### Update Information

- **Method**: PUT
- **URL**: `http://localhost:3000/profiles/{profile_id}/information`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "bio": "Full-stack developer",
  "location": "Paris, France",
  "website": "https://johndoe.com"
}
```

### Bonus : additionnal filters


- **URL**: `http://localhost:3000/profiles?name=John`
- **URL**: `http://localhost:3000/profiles?skill=JavaScript`
- **URL**: `http://localhost:3000/profiles?info_location=Paris`
- **URL**: `http://localhost:3000/profiles?search=developer`
- **URL**: `http://localhost:3000/profiles?email=example.com`

### Bonus : friends route

#### Add a Friend

- **Method**: POST
- **URL**: `http://localhost:3000/profiles/{profile_id}/friends/{friend_id}`
- **Description**: Add a friend relationship between two profiles

#### Get All Friends

- **Method**: GET
- **URL**: `http://localhost:3000/profiles/{profile_id}/friends`
- **Description**: Retrieve all friends of a profile

#### Remove a Friend

- **Method**: DELETE
- **URL**: `http://localhost:3000/profiles/{profile_id}/friends/{friend_id}`
- **Description**: Remove a friend relationship between two profiles
