# Database Seeder - Initial Users

This seeder creates initial users for testing the RBAC (Role-Based Access Control) system.

## Created Users

The seeder will create three users with different roles:

### 1. Admin User

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `admin`
- **Permissions:**
  - user:create
  - user:update
  - user:delete
  - role:assign
  - role:view

### 2. Manager User

- **Email:** `manager@example.com`
- **Password:** `manager123`
- **Role:** `manager`
- **Permissions:**
  - user:create
  - user:update
  - role:view

### 3. Viewer User

- **Email:** `viewer@example.com`
- **Password:** `viewer123`
- **Role:** `viewer`
- **Permissions:**
  - role:view

## How to Run the Seeder

To populate the database with initial users, run:

```bash
npx sequelize-cli db:seed:all
```

To undo the seeder (remove the users):

```bash
npx sequelize-cli db:seed:undo
```

## Important Notes

- Make sure you have run migrations before running seeders
- Passwords are hashed using bcrypt with 10 salt rounds
- These are test accounts - change passwords in production!
