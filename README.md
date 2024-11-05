# Evore Be Test

Backend Developer Intern Test Project

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Useful Commands](#useful-commands)

## Features

Primary features of this project:

- **User Authentication**: User registration, login. JWT-based authentication.
- **Data Validation**: Input validation using class validators.
- **API Documentation**: Swagger API documentation accessible at `/api/v1/docs`.
- **Error Handling**: Custom error handling and informative error responses.
- **Logging**: Application-wide request and response logging.
- **Rate Limiting**: Protect routes from excessive requests.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [NestJS CLI](https://docs.nestjs.com/) (optional, for easier development)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/imkhoirularifin/be-test.git
   cd be-test
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install NestJS CLI globally (optional):

   ```bash
   npm install -g @nestjs/cli
   ```

## Configuration

### Environment Variables

1. Create a `.env` file in the root directory of your project.
2. Add environment variables. Below is an example of typical variables:

   ```plaintext
   # Server
   DOMAIN=http://localhost:3000

   # Database
   DATABASE_URL=mysql://user:password@host:3306/db_name

   # JWT
    JWT_SECRET=your-secret
   ```

3. Update these values based on your setup (e.g., database credentials).

### Prisma

Set up database by running:

```bash
npx prisma db push
```

## Running the Application

### Development

To start the application in development mode with hot reloading:

```bash
npm run start:dev
```

The application should now be running on `http://localhost:3000` by default.

### Production

To build and run the application in production mode:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the application:

   ```bash
   npm run start:prod
   ```

## Testing

### Unit Tests

Run unit tests with:

```bash
npm run test
```

### End-to-End Tests

Run end-to-end tests with:

```bash
npm run test:e2e
```

### Test Coverage

Generate test coverage reports:

```bash
npm run test:cov
```

## Useful Commands

- **Start Development Server**: `npm run start:dev`
- **Start Production Server**: `npm run start:prod`
- **Lint Code**: `npm run lint`
- **Format Code**: `npm run format`
- **Run Unit Tests**: `npm run test`
- **Run E2E Tests**: `npm run test:e2e`
- **Generate Test Coverage**: `npm run test:cov`
