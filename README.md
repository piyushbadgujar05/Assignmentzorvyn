# Finance Data Processing & Access Control API

A secure, production-ready backend built with Node.js, Express, and MongoDB for managing financial records with robust Role-Based Access Control (RBAC).

---

## 🚀 Project Overview
This project satisfies all the core requirements of the Finance Data Processing and Access Control Backend internship assignment. It is designed to evaluate backend engineering skills such as API design, data modeling, business logic, and access control.

---

## ✨ Key Features (Satisfying Assignment Requirements)

### 1. User and Role Management
- **Stateless Auth**: JWT-based authentication with secure password hashing via `bcrypt`.
- **Granular RBAC**:
  - **Viewer**: Read-only access to dashboard data.
  - **Analyst**: Can create, view, and update their own records.
  - **Admin**: Full management access (Create, Update, Manage Records/Users).
- **User Status**: Supports `active` and `inactive` statuses, restricting access for inactive users.
- **Role Enforcement**: Implemented via a reusable `authorize` middleware.

### 2. Financial Records Management
- **Full CRUD**: Support for creating, viewing, updating, and deleting records.
- **Fields**: Each record contains `amount`, `type` (income/expense), `category`, `date`, and `description`.
- **Advanced Querying**: Support for filtering (by date, category, type), sorting, and pagination.

### 3. Dashboard Summary APIs (Advanced Aggregation)
- **Aggregation Pipelines**: Real-time financial calculations processed directly on MongoDB for efficiency.
- **Summary**: `totalIncome`, `totalExpense`, `netBalance`, and `recordCount`.
- **Trends**: 6-month chronological income vs. expense trends.
- **Breakdown**: Expense distribution by category.
- **Recent Activity**: The 5 most recent transactions for the user.

### 4. Access Control Logic
- **RBAC Middleware**: Restricts route access based on user roles.
- **Ownership Check**: Analysts are restricted to managing *only their own data* via service-layer validation.
- **Viewer Restriction**: Viewers are strictly prohibited from any write operations.

### 5. Validation and Error Handling
- **Input Validation**: Schema-level validation in Mongoose ensures data integrity.
- **Global Error Handler**: A centralized middleware in `app.js` ensures that every error returns a clean, structured JSON response with appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500).

### 6. Data Persistence
- **MongoDB & Mongoose**: Used as a document database for flexible data modeling and efficient aggregation pipelines.
- **Indexing**: Compound indexing on `{ userId: 1, date: -1 }` ensures high-performance lookups.

---

## 📂 API Endpoints

### Auth
- `POST /api/auth/register` - Create a new user.
- `POST /api/auth/login` - Authenticate and receive a token.

### Records
- `GET /api/records` - List records (supports `page`, `limit`, `type`, `category`, `sortBy`, `order`).
- `POST /api/records` - Create a record (Analyst/Admin only).
- `PATCH /api/records/:id` - Update a record (Owner or Admin).
- `DELETE /api/records/:id` - Soft delete a record (Admin only).

### Dashboard
- `GET /api/dashboard/summary` - Overall financial metrics.
- `GET /api/dashboard/trends` - 6-month monthly trends.
- `GET /api/dashboard/category-breakdown` - Expense distribution.
- `GET /api/dashboard/recent` - 5 most recent activities.

---

## 🧠 Design Decisions & Trade-offs

1. **Layered Architecture**: I separated the logic into **Controllers** (HTTP handling), **Services** (Business rules/Aggregations), and **Models** (Data structure). This ensures separation of concerns and makes the code maintainable.
2. **Service Layer Ownership**: Ownership checks are handled in the Service layer. This ensures that even if a route is misconfigured, the business logic remains the ultimate gatekeeper.
3. **Aggregation vs. In-Memory**: I chose to perform all financial calculations using **MongoDB Aggregation Pipelines**. This is far more efficient than fetching thousands of records into Node.js memory.
4. **Soft Deletes**: In financial systems, "hard deleting" data is often dangerous. I implemented `isDeleted` and `deletedAt` fields to preserve history while keeping the active UI clean.
5. **Humanized Comments**: I've included comments that explain the **"why"** behind technical choices, showing a deeper understanding of system design.

---

## ⚙️ Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
3. **Run the App**:
   - `npm run dev` (Development mode with auto-reload)
   - `npm start` (Production mode)

---

## 📝 Assumptions Made
- User roles are assigned at registration (defaulting to Analyst).
- Categories are flexible strings normalized to lowercase for consistent grouping.
- Financial amounts are stored as positive numbers; the `type` field ('income' or 'expense') determines the mathematical sign during processing.

---
*Developed for Internship Assignment Evaluation*
