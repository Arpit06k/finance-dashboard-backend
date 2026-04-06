# Finance Dashboard Backend

A robust, enterprise-grade backend for a financial dashboard application. Built with Node.js, Express, TypeScript, and MongoDB (Mongoose), it provides secure authentication, role-based access control, strict data validation, advanced data aggregation, and comprehensive audit trails.

## Features

- **Authentication & Security**
  - **JWT Authentication**: Secure endpoints relying on JSON Web Tokens.
  - **Password Hashing**: Passwords secured via `bcryptjs`.
  - **Middleware Defenses**: Enhanced HTTP header security via `helmet`, Cross-Origin Resource Sharing (`cors`), and brute-force prevention via `express-rate-limit`.
- **Role-Based Access Control (RBAC)**
  - Hierarchical roles: `viewer`, `analyst`, to `admin`.
  - Route-level and data-level access limits based on user privileges.
- **Financial Record Management**
  - **CRUD Operations**: Securely and easily manage income and expenses.
  - **Pagination & Search**: Optimized data fetching for massive datasets using limit, page, and regex text searching.
  - **Soft Deletes**: Financial records are never hard-deleted. The `isDeleted` flag preserves financial history and data integrity.
  - **Input Validation**: Guaranteed payload integrity using `zod` schema typing algorithms.
  - **CSV Export Feature**: Dynamically download a spreadsheet of filtered financial records.
- **Dynamic Dashboards & Aggregations**
  - **Aggregated Summaries**: Mongoose pipelines computing net balances, total specific incomes, and categorized spending distributions.
- **Enterprise Capabilities**
  - **Audit Logging**: Fully-automated tracking for all Database mutational queries (CREATE, UPDATE, DELETE). Tracks exactly who committed the action and documents payload differences.
  - **Background Task Scheduling**: Integrated `node-cron` routines simulating automated weekly summary reports via server-side background processes.
  - **Robust Error Handling**: Centralized `AppError` handlers working in tandem with a unified `catchAsync` wrapper protecting controller boundaries.

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)

### Installation
1. Clone the repository and install the initial dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and supply your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finance_dashboard
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Seeding the Database
To quickly test the application, a `seed.ts` script is provided. It creates an `Admin`, `Analyst`, and `Viewer` account while pre-populating them with randomized income and expense records.
```bash
npx ts-node seed.ts
```

### Running the Application
Start the server in development mode using `ts-node-dev`:
```bash
npx ts-node-dev --files src/server.ts
```
Or, assuming you have `nodemon` or standard npm scripts configured:
```bash
npm run dev
```

---

## API Structure

All routes are correctly prefixed with `/api`. Protected routes require a valid `Bearer <Token>` placed in the `Authorization` header.

### Authentication (`/api/auth`)
- `POST /register`: Register a new user (`name`, `email`, `password`, `role`).
- `POST /login`: Generate JWT authentication signatures.

### Financial Records (`/api/records`)
- `GET /`: Retrieve paginated records (Role: `analyst`, `admin`).
- `POST /`: Submit new financial logs (Role: `admin`).
- `PUT /:id`: Update an existing transaction (Role: `admin`).
- `DELETE /:id`: Safely mark transactions as deleted (Role: `admin`).
- `GET /export`: Download a constructed CSV file of records.

### Dashboards (`/api/dashboard`)
- `GET /summary`: Aggregates records returning overall spending limits, incomes, net balance, and breakdown arrays of categories.

### Audit Trails (`/api/audit`)
- `GET /`: Retrieve the unified, timestamped log of server mutational activities (Role: `admin`).

---

## Architecture details
- **/models**: Mongoose schema definitions and typing interfaces.
- **/controllers**: Express route logic intercepting endpoints to provide to services.
- **/services**: Pure logic layer performing calculations and strict database transactions.
- **/routes**: Express route binders and RBAC middleware mapping endpoints.
- **/middleware**: Global utility interceptors processing auth, protection guards, and server errors.
- **/jobs**: Scheduled backend tasks mapped to Cron.
- **/utils**: Helper modules such as standardized Zod Schemas and global Custom Error constructors mapping accurately to responses.
