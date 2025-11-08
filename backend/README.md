# Portfolio Backend API

Backend server for storing contact messages, tracking profile views, and managing analytics.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Create `.env` file (see `.env.example` for template)
   - Set your PostgreSQL database credentials
   - Format: `DATABASE_URL=postgresql://username:password@host:port/database_name`

3. **Start server:**
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode (with auto-reload)
   ```

## API Endpoints

### Messages
- `POST /api/messages` - Store contact form message
- `GET /api/messages` - Get all messages
- `GET /api/messages/count` - Get message count

### Profile Views
- `POST /api/views` - Track profile view
- `GET /api/views/count` - Get total views
- `GET /api/views/visitors/count` - Get unique visitors
- `GET /api/views/analytics` - Get analytics data

### Health Check
- `GET /api/health` - Check server and database status

## Database

The database schema is in `database/schema.sql`. 

### Setting up PostgreSQL:

1. **Check database connection:**
   ```powershell
   .\check-db.ps1
   ```
   This will check your PostgreSQL connection and create the database if needed.

2. **Run schema manually (if needed):**
   ```powershell
   .\run-schema.ps1 -DatabaseName "portfolio_db" -Username "postgres"
   ```

3. **Or let the server initialize tables automatically:**
   The server will automatically create tables on startup if they don't exist.

## Environment Variables

Required in `.env` file:
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database_name`
  - Example: `postgresql://postgres:mypassword@localhost:5432/portfolio_db`
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (optional)
- `NODE_ENV` - Environment mode: `development` or `production` (optional)

## Project Structure

```
backend/
├── config/
│   └── database.js      # Database configuration
├── routes/
│   ├── messages.js      # Message endpoints
│   └── views.js         # View tracking endpoints
├── database/
│   └── schema.sql       # Database schema
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables (create this)
```
