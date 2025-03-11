# Mongoose Project

A Node.js application using MongoDB and Mongoose ODM.

## Prerequisites

- Node.js (v14 or newer)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Docker and Docker Compose (optional, for containerized setup)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mongoose-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Environment setup:
   
   Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
# If using Docker: MONGODB_URI=mongodb://mongo:27017/your_database
# Replace with your MongoDB connection string if using Atlas
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

### Using Docker

1. Build and start the containers:
```bash
docker-compose up -d
```

2. Stop the containers:
```bash
docker-compose down
```

3. View logs:
```bash
docker-compose logs -f
```

## Docker Configuration

This project includes Docker configuration for easy setup:

- `Dockerfile`: Configures the Node.js application container
- `docker-compose.yml`: Orchestrates the application and MongoDB services
- MongoDB data is persisted using Docker volumes

### MongoDB with Docker

When using the Docker setup, MongoDB will be available at:
- Host: `mongo` (container name)
- Port: `27017`
- Connection string: `mongodb://mongo:27017/your_database`

## Project Structure

```
mongoose-project/
├── config/            # Configuration files
├── controllers/       # Route controllers
├── models/            # Mongoose models
├── routes/            # API routes
├── middlewares/       # Custom middlewares
├── utils/             # Utility functions
├── .env               # Environment variables
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── package.json       # Project dependencies
└── server.js          # Entry point
```

## API Endpoints

- `GET /api/resource` - Get all resources
- `GET /api/resource/:id` - Get a specific resource
- `POST /api/resource` - Create a new resource
- `PUT /api/resource/:id` - Update a resource
- `DELETE /api/resource/:id` - Delete a resource

## Database

This project uses MongoDB with Mongoose ODM. Models are defined in the `/models` directory.

## License

[MIT](LICENSE)