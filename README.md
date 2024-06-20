# Article Nest

Article Nest is a Content Management System (CMS) built with Node.js, Express, Prisma, and SQLite. The project provides functionalities for user management, role-based access control, content creation, categorization, tagging, and commenting.

## Table of Contents
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Prisma Schema](#prisma-schema)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Validation](#validation)

## Installation

To get started with the project, follow these steps:

1. **Install all dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Migrate the database:**
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database with dummy data:**
   ```bash
   npm run seed
   ```

## Running the Project

To run the project after completing the above steps, use the following command:
```bash
npm start
```

## Prisma Schema

This project uses Prisma as the ORM. Below is the Prisma schema used in this project. The schema defines the database models and their relationships.

### `schema.prisma`
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Define the data model for the CMS

// User entity
model User {
  UserID      Int       @id @default(autoincrement())
  Username    String    @unique
  Email       String    @unique
  Password    String
  Role        Role      @relation(fields: [RoleID], references: [RoleID])
  RoleID      Int
  comments    Comment[]
  authoredContents   Content[] @relation("Author")
}

// Role entity
model Role {
  RoleID      Int       @id @default(autoincrement())
  RoleName    String
  users       User[]
}

// Content entity
model Content {
  ContentID           Int       @id @default(autoincrement())
  ContentType         String
  Title               String
  ContentDescription  String
  author              User      @relation("Author", fields: [UserID], references: [UserID])
  UserID              Int
  categories          Category[]
  tags                Tag[]
  comments            Comment[]
}

// Category entity
model Category {
  CategoryID      Int       @id @default(autoincrement())
  CategoryName    String
  contents        Content[]
}

// Tag entity
model Tag {
  TagID       Int       @id @default(autoincrement())
  TagName     String
  contents    Content[]
}

// Comment entity
model Comment {
  CommentID     Int       @id @default(autoincrement())
  CommentText   String
  CommentDate   DateTime
  user          User      @relation(fields: [UserID], references: [UserID])
  UserID        Int
  content       Content   @relation(fields: [ContentID], references: [ContentID])
  ContentID     Int
}
```

## API Endpoints

The project includes the following API endpoints:

### Users
- `POST /users`: Create a new user
- `GET /users`: Get all users
- `GET /users/:id`: Get a user by ID
- `PUT /users/:id`: Update a user by ID
- `DELETE /users/:id`: Delete a user by ID

### Roles
- `POST /roles`: Create a new role
- `GET /roles`: Get all roles
- `GET /roles/:id`: Get a role by ID
- `PUT /roles/:id`: Update a role by ID
- `DELETE /roles/:id`: Delete a role by ID

### Categories
- `POST /categories`: Create a new category
- `GET /categories`: Get all categories
- `GET /categories/:id`: Get a category by ID
- `PUT /categories/:id`: Update a category by ID
- `DELETE /categories/:id`: Delete a category by ID

### Tags
- `POST /tags`: Create a new tag
- `GET /tags`: Get all tags
- `GET /tags/:id`: Get a tag by ID
- `PUT /tags/:id`: Update a tag by ID
- `DELETE /tags/:id`: Delete a tag by ID

### Comments
- `POST /comments/:contentId`: Create a new comment
- `PUT /comments/:id`: Update a comment by ID
- `DELETE /comments/:id`: Delete a comment by ID
- `GET /comments/:contentId`: Get comments for a content by content ID

### Content
- `POST /content`: Create new content
- `GET /content`: Get all content
- `GET /content/:id`: Get content by ID
- `PUT /content/:id`: Update content by ID
- `DELETE /content/:id`: Delete content by ID

## Middleware

### Authentication Middleware

Middleware to authenticate users using JWT tokens.

### Role-Based Access Control (RBAC) Middleware

Middleware to enforce role-based access control.

### Zod Validation Middleware

Middleware to validate request bodies using Zod schemas.

## Validation

The project uses Zod for schema validation. Each API endpoint has an associated Zod schema to validate the request data. Here are examples for the comments endpoint:

### `commentSchemas.ts`

```typescript
import { z } from 'zod';

export const createCommentSchema = z.object({
    body: z.object({
        commentText: z.string().min(3),
        userId: z.number().int(),
    }),
    params: z.object({
        contentId: z.string().regex(/^\d+$/)
    })
});

export const updateCommentSchema = z.object({
    body: z.object({
        commentText: z.string().min(3),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});

export const deleteCommentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});

export const getCommentsForContentSchema = z.object({
    params: z.object({
        contentId: z.string().regex(/^\d+$/)
    })
});
```

### `validate.ts`

```typescript
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: 'error',
                errors: error.errors,
            });
        }
        next(error);
    }
};

export default validate;
```

This README file provides a comprehensive overview of the Article Nest project, including installation instructions, details about the Prisma schema, API endpoints, middleware, and validation. By following these instructions, you should be able to set up and run the project successfully.
