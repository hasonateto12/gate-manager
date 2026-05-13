# Gate Manager API 🚪

Gate Manager is a smart gate management system built with Node.js, Express, and MySQL.

The system manages:
- Employees
- Vehicles
- Entry requests
- Access approvals
- Entry logs

The project includes JWT authentication, role-based authorization, request validation, Swagger API documentation, security middleware, and logging.

---

# Features ✨

## Authentication & Authorization
- User registration
- User login
- JWT authentication
- Role-based permissions
- Admin/User access control

---

## Employees Management
- Create employee
- Get all employees
- Update employee
- Delete employee

---

## Vehicles Management
- Create vehicle
- Get all vehicles
- Update vehicle
- Delete vehicle

---

## Entry Requests Workflow
- Create entry request
- Approve request
- Reject request
- Add rejection reason
- Track request status

---

## Automatic Entry Logs
When a request is approved or rejected:
- The system automatically creates a log entry
- Links logs to employees and vehicles
- Stores approval results and notes

---

## Dashboard
- Dashboard statistics
- Search functionality

---

## API Documentation
- Swagger UI documentation
- Request/response examples
- JWT authorization support

---

## Security
- Helmet security headers
- Rate limiting
- JWT protection
- Request validation
- Global error handling

---

## Logging
- Morgan request logging
- Winston logger
- Error logging

---

# Technologies Used 🛠️

- Node.js
- Express.js
- MySQL
- Swagger UI
- JWT
- bcrypt
- express-validator
- Helmet
- express-rate-limit
- Morgan
- Winston

---

# Database Structure 🗄️

## users
Stores system users and roles.

Fields:
- id
- full_name
- username
- email
- password_hash
- role
- created_at

---

## employees
Stores employees information.

Fields:
- id
- full_name
- employee_number
- department
- phone
- is_active
- created_at

---

## vehicles
Stores vehicles linked to employees.

Fields:
- id
- plate_number
- vehicle_type
- color
- employee_id
- status
- created_at

---

## entry_requests
Stores vehicle access requests.

Fields:
- id
- vehicle_id
- request_time
- status
- approved_by
- rejection_reason
- notes

---

## entry_logs
Stores access logs and approval history.

Fields:
- id
- vehicle_id
- employee_id
- entry_time
- exit_time
- result
- handled_by
- notes

---

# Installation ⚙️

## Clone the repository

```bash
git clone https://github.com/hasonateto12/gate-manager.git
