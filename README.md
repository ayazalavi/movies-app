# Movies App — Next.js + Server Actions + AWS App Runner + S3

A minimal movie management app built using **modern Next.js App Router**.

* ✅ **Authentication via API endpoints** (`/api/auth/signin`, `/api/auth/logout`)
* ✅ **Movie CRUD handled via Server Actions** (no client fetches)
* ✅ **Poster uploads** using AWS S3 bucket
* ✅ **Deployed on AWS App Runner**
* ✅ **Database: PostgreSQL (Neon) using Prisma**

---

## How the flow works

| Operation                     | Mechanism                                           | Layer                            |
| ----------------------------- | --------------------------------------------------- | -------------------------------- |
| Sign in / Logout              | API endpoints (`/api/auth/*`)                       | Auth routes — returns JWT cookie |
| Create / Edit / Delete movies / Upload poster | **Server Actions**                                  | Runs on server, no REST fetch    |  |
| Pagination                    | Happens on `GET /my-movies?page=N`                  | Server component querying Prisma |
| Database                      | Prisma + PostgreSQL (Neon)                          | Data storage                     |

---

## Architecture Overview

```
Client (Next.js UI Components)
  │
  ├── Auth API (REST)
  │     POST /api/auth/signin     -> validates user + sets JWT cookie
  │     POST /api/auth/logout     -> clears cookie
  │
  ├── Server Actions (Movies CRUD)
  │     createMovieAction(formData)
  │     updateMovieAction(formData)
  │     deleteMovieAction(movieId)
  │
  └── Prisma ORM + Neon Postgres
```

**App Runner** runs the Next.js server,
**S3** stores poster images (public read, uploads via aws sdk).

---

## Pages (Next.js App Router)

| Page                    | Path                               | Description                              |
| ----------------------- | ---------------------------------- | ---------------------------------------- |
| Sign in                 | `/`                                | Auth form → calls `/api/auth/signin`     |
| Movies list (paginated) | `/my-movies?page=1`                | Uses Server Component + Prisma           |
| Create movie            | `/my-movies/new`                   | Uses Server Action `createMovieAction()` |
| Edit movie              | `/my-movies/[id]`                  | Uses Server Action `updateMovieAction()` |
| Logout                  | button triggers `/api/auth/logout` | Clears JWT cookie                        |

---

## Server Actions (Movie CRUD)

In `app/my-movies/new/_actions.ts`:

```ts
"use server";

export async function createMovieAction(formData: FormData) {
  // validate with Zod
  // if poster required: upload to S3 using api/upload-url
  // prisma.movie.create(...)
}
```

Server actions run **directly on the server**, no fetch calls are required.

---

## Authentication (REST API)

| Endpoint           | Method | Payload                         | Result          |
| ------------------ | ------ | ------------------------------- | --------------- |
| `/api/auth/signin` | `POST` | `{ email, password, remember }` | Sets JWT cookie |
| `/api/auth/logout` | `POST` | —                               | Deletes cookie  |

JWT cookie is HTTP-only → secure from JS mutation.

---

## S3 Bucket (no ACLs)

We don't use ACLs — we use **bucket policy (public read)**:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
  }]
}
```

Uploads remain secure because only **pre-signed PUT** is allowed.

---

## Deploy (AWS App Runner in 4 steps)

1. Push repo to GitHub
2. App Runner → **Create service → From source code repository**
3. Build / Run config:

```
Build command: pnpm install && pnpm build
Start command: pnpm start
```

4. Add environment variables

```env
DATABASE_URL=...
JWT_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=...
S3_PUBLIC_BASE_URL=https://bucket-name.s3.amazonaws.com
```

---

## Test user

| Email                  | Password  |
| ---------------------- | --------- |
| `admin@movies-app.com` | `Pass123` |

Created from `prisma/seed.ts`.

---

## Features

* [x] Login & logout (JWT cookie)
* [x] Add movies (Server actions)
* [x] Edit movies (Server actions)
* [x] Paginated listing
* [x] Field validation (Zod)
