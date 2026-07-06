# Blog Management System

A full-stack Blog Management System built with **Django REST Framework** (backend) and **React + Vite** (frontend), using JWT authentication and ownership-based access control.

Users can log in, create and manage their own blog posts, view posts by other users, and comment on any post. Administrators create and manage user accounts through the Django Admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django |
| API Layer | Django REST Framework |
| Authentication | JWT (djangorestframework-simplejwt) |
| CORS Handling | django-cors-headers |
| Database | SQLite (development) |
| Frontend | React (Vite) |
| Routing | React Router |
| HTTP Client | Axios |

---

## Features

- Administrator-managed user accounts (Django Admin)
- JWT-based login with automatic access token refresh
- Create, view, update, and delete your own blog posts
- View blog posts created by any user
- Add, edit, and delete comments on posts
- Ownership enforced on both frontend (UI) and backend (API-level permissions)
- Server-side validation on all write operations

---

## Project Structure

```
blog-management-system/
├── backend/
│   ├── config/            # Project settings and root URL routing
│   ├── blog/               # Models, serializers, views, permissions
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios calls to the Django API
│   │   ├── context/          # Auth state (AuthContext)
│   │   ├── components/        # Navbar, PostCard, CommentItem, etc.
│   │   └── pages/               # LoginPage, PostListPage, PostDetailPage, etc.
│   └── package.json
└── README.md
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- Git

---

## Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

   On Windows: `venv\Scripts\activate`

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:

   ```bash
   python manage.py migrate
   ```

5. Create an administrator account:

   ```bash
   python manage.py createsuperuser
   ```

6. Start the backend server:

   ```bash
   python manage.py runserver
   ```

The API will be running at `http://127.0.0.1:8000/`.
The Django Admin panel will be at `http://127.0.0.1:8000/admin/`.

### Creating Users

There is no public signup endpoint, by design. All user accounts are created by an administrator through the Django Admin panel:

```
http://127.0.0.1:8000/admin/ → Users → Add user
```

---

## Frontend Setup

1. In a **separate terminal**, navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `frontend/` root with the following content:

   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

   > **This step is required and cannot be skipped.** The `.env` file is intentionally excluded from version control (via `.gitignore`), so it will not exist after cloning this repository. Without it, `VITE_API_URL` will be `undefined` and every request to the backend will silently fail. You must create this file yourself before running the frontend.

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

The app will be running at `http://localhost:5173/`.

---

## Running the Application

Both servers must be running at the same time, in two separate terminals:

```bash
# Terminal 1
cd backend && source venv/bin/activate && python manage.py runserver

# Terminal 2
cd frontend && npm run dev
```

Then open `http://localhost:5173/` in your browser and log in with a user account created via the Django Admin panel.

---

## Authentication

Authentication uses JSON Web Tokens (JWT).

**Login:**

```
POST /api/token/
```

Request body:

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

Response:

```json
{
  "access": "...",
  "refresh": "...",
  "user_id": 1,
  "username": "your_username"
}
```

All subsequent authenticated requests include the access token in the header:

```
Authorization: Bearer <access_token>
```

If the access token expires, the frontend automatically uses the refresh token to obtain a new one via:

```
POST /api/token/refresh/
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/token/` | Log in and receive tokens | No |
| POST | `/api/token/refresh/` | Refresh an access token | No |

### Posts

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/posts/` | List all posts | Yes |
| POST | `/api/posts/` | Create a new post | Yes |
| GET | `/api/posts/{id}/` | View a post with its comments | Yes |
| PUT / PATCH | `/api/posts/{id}/` | Update a post | Yes — owner only |
| DELETE | `/api/posts/{id}/` | Delete a post | Yes — owner only |

### Comments

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/comments/?post={id}` | List comments for a post | Yes |
| POST | `/api/comments/` | Add a comment | Yes |
| PUT / PATCH | `/api/comments/{id}/` | Update a comment | Yes — owner only |
| DELETE | `/api/comments/{id}/` | Delete a comment | Yes — owner only |

---

## Access Control Summary

- All API endpoints require authentication by default.
- Any authenticated user may **view** any post or comment.
- Only the **original author** of a post or comment may update or delete it.
- Attempting to modify another user's content returns `403 Forbidden`.
- Unauthenticated requests return `401 Unauthorized`.
- The frontend hides Edit/Delete controls for content you don't own, but this is a UX convenience only — the backend permission checks are the actual enforcement, and reject unauthorized writes regardless of what the UI shows.

---

## Troubleshooting

**Frontend loads, but no data appears / all API calls fail:**
Make sure you've created the `frontend/.env` file as described in the Frontend Setup section above. This file is git-ignored and must be created manually after cloning.

**CORS errors in the browser console:**
Vite's default port is `5173`. If that port is already in use on your machine, Vite will automatically start on the next available port (`5174`, `5175`, etc.) and print the actual URL in the terminal. If this happens, that new port won't match the `CORS_ALLOWED_ORIGINS` setting in `backend/config/settings.py`, and the browser will block requests. To fix this:

1. Note the port Vite actually printed in the terminal.
2. Add it to `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`, e.g.:

   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "http://localhost:5174",
   ]
   ```

3. Restart the Django server.

**401 Unauthorized on every request:**
Your access token may have expired and the refresh token may also be invalid or missing. Log out and log back in.

---

## Design Notes

- **SQLite** is used for development simplicity. Django's ORM is database-agnostic, so switching to PostgreSQL for production is a configuration change in `settings.py`, not a code change.
- **Django's built-in User model** is used rather than a custom user model, since the project doesn't require extra profile fields.
- **JWT authentication** was chosen over session-based authentication because it's stateless and well-suited to a decoupled frontend consuming the API from a different origin.
- **`IsAuthenticated` is the global default permission**, with access opened up selectively per-endpoint rather than the reverse — a secure-by-default posture.
