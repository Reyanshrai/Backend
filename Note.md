# 🚀 Backend Fundamentals – Personal Handbook

**Practical backend notes for building real, secure, and scalable APIs.**

## 🧠 Core Mindset of Backend

In backend development, everything revolves around two objects:

- **req** → What the user sends
- **res** → What the server sends back

**A user can only request. The server always responds.**

## 🔐 4 Stages of Security (Authentication Flow)

| Stage | Description | Example |
|-------|-------------|---------|
| **Validation** | Is the data in the correct format? | Email format check |
| **Verification** | Is the data real? | Email exists in DB |
| **Authentication** | Who is making the request? | JWT token verification |
| **Authorization** | What is this user allowed to access? | User role/permission check |

## 🪪 JWT (JSON Web Token)

**`jwt.sign()` requires:**

1. **Unique user data** (e.g., `userId`, `email`)
2. **JWT Secret key**

**JWT is used to identify real users on each request.**
*Usually stored in cookies or Authorization headers.*

## 🗂️ Ideal Backend Folder Structure

root/
│
├── src/
│ ├── app.js
│ ├── routes/
│ ├── controllers/
│ ├── services/
│ ├── models/
│ ├── middlewares/
│ ├── validators/
│ ├── db/
│ └── utils/
│
├── server.js
├── package.json
└── .env


### Folder Responsibilities

| Folder | Responsibility |
|--------|----------------|
| `routes` | Define API endpoints |
| `controllers` | Handle req/res logic |
| `services` | Business logic |
| `models` | DB schemas |
| `middlewares` | Auth, validation, error handling |
| `validators` | Request data validation |
| `db` | Database connection |
| `utils` | Helper functions |

## 🌐 HTTP Methods (All APIs depend on these)

| Method | Purpose |
|--------|---------|
| **GET** | Fetch data |
| **POST** | Create data |
| **PATCH** | Update partial data |
| **DELETE** | Remove data |

## 📦 Understanding `req`

| Property | Meaning |
|----------|---------|
| `req.params` | Data from URL (e.g. `/user/123`) |
| `req.query` | Data from query string (`?page=2`) |
| `req.body` | Data sent from frontend (form/json) |
| `req.headers` | Token, auth info |
| `req.cookies` | JWT stored in cookies |

## 📤 Sending Proper Responses

**Always send:**
- Correct HTTP status code
- Proper JSON response

### Common Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `401` | Unauthorized |
| `403` | Forbidden |
| `500` | Server error |

## 🌍 Why CORS?

**CORS allows your backend to accept requests from other origins (frontend servers).**

- **Without CORS** → Browser blocks the request
- **With CORS** → Cross-origin requests work smoothly

## 🧩 Essential Middlewares

```javascript
app.use(express.json());     // Parse JSON body
app.use(cookieParser());     // Read cookies


Other important middlewares:

Auth middleware (JWT verify)

Error handling middleware

Validation middleware

🗃️ Database & Models
To store data:

Connect DB in db/

Create schema in models/

Use models in controllers/services

Using Mongoose for MongoDB.

Common Mongoose Methods

create()
find()
findById()
findOneAndUpdate()
findByIdAndDelete()


📁 File Upload
Use Multer middleware when uploading files to server.

🧠 How Backend Talks to DB
Controllers → Services → Models → DB


Controllers never talk to DB directly.
This keeps code clean and scalable.

🛡️ API Protection Best Practices
✅ Validate all inputs
✅ Use JWT authentication
✅ Hash passwords (bcrypt)
✅ Use HTTPS
✅ Use environment variables for secrets
✅ Rate limit APIs
✅ Proper error handling (don't expose internals)

🧭 Request Lifecycle (Big Picture)

Client → Route → Middleware → Controller → Service → Model → DB
                                             ↓
                                        Response


🧪 What to Practice to Become Strong in Backend
Build CRUD APIs

Implement JWT auth from scratch

Practice req.params, req.query, req.body

Create proper folder structure in every project

Handle errors globally

Add validation in every route

✅ Golden Rule