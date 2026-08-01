# Student Management System

A minimal, clean, CloudBlitz-inspired **3-tier Web Application** built with:

- **Frontend**: React (Vite) + Axios — served via Nginx
- **Backend**: Flask (Python) + REST API
- **Database**: MySQL 8.0

---

## Project Structure

```
Docker-PROJECT/
├── backend/
│   ├── app.py              # Flask API & MySQL connection logic
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Backend environment variables (used by Flask + Docker)
│   ├── .env.example        # Environment variable template
│   └── Dockerfile          # Backend Docker image build instructions
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Top navigation bar
│   │   │   ├── StudentForm.jsx  # Student entry form with validation
│   │   │   ├── StudentTable.jsx # Student data table display
│   │   │   └── DeleteModal.jsx  # Delete confirmation modal
│   │   ├── App.jsx              # Main React application component
│   │   ├── index.css            # CloudBlitz styling & CSS design system
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                     # Frontend environment variables
│   ├── .env.example
│   └── Dockerfile               # Multi-stage Nginx Dockerfile for React
├── docker-compose.yml           # Complete 3-tier multi-container orchestration
└── README.md
```

---

## Environment Variables

### `backend/.env`

```env
DB_HOST=mysql          # Must match the MySQL service name in docker-compose
DB_USER=root
DB_PASSWORD=root
DB_NAME=student_db
DB_PORT=3306
FLASK_PORT=5005
```

> For local development without Docker, set `DB_HOST=localhost`.

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5005
```

> When running via Docker Compose, the browser still hits `localhost:5005` since the backend port is published to the host.

---

## Option 1: Run with Docker Compose (Recommended)

All env values are loaded automatically from the `.env` files via `env_file` in `docker-compose.yml`.

```bash
docker compose up --build
```

Access the app:

- **Frontend UI**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5005/students`
- **Health Check**: `http://localhost:5005/health`

Stop and remove containers:

```bash
docker compose down
```

Stop and also remove the persistent volume (wipes DB data):

```bash
docker compose down -v
```

---

## Option 2: Run Individual Containers (Manual Docker Commands)

### 1. Create Docker Network

```bash
docker network create student-network
```

### 2. Start MySQL Container

```bash
docker run -d \
  --name student_mysql_db \
  --network student-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=student_db \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=root \
  -p 3306:3306 \
  mysql:8.0
```

### 3. Build & Run Flask Backend Container

```bash
cd backend
docker build -t student-backend .
docker run -d \
  --name student_flask_api \
  --network student-network \
  --env-file .env \
  -p 5005:5005 \
  student-backend
```

> `--env-file .env` loads all backend variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, FLASK_PORT) from `backend/.env` directly.
>
> Make sure `DB_HOST=mysql` in `backend/.env` matches the `--name` of your MySQL container (`student_mysql_db` → use `student_mysql_db` as DB_HOST when running manually, or rename the MySQL container to `mysql`).

### 4. Build & Run React Frontend Container

```bash
cd ../frontend
docker build -t student-frontend .
docker run -d \
  --name student_react_app \
  --network student-network \
  --env-file .env \
  -p 3000:80 \
  student-frontend
```

---

## Option 3: Run Locally Without Docker

### Prerequisites

- Python 3.10+
- Node.js 18+ & npm
- Local MySQL Server running on port 3306

### 1. Database Setup

```sql
CREATE DATABASE IF NOT EXISTS student_db;
```

### 2. Configure Backend `.env`

In `backend/.env`, set:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=student_db
DB_PORT=3306
FLASK_PORT=5005
```

### 3. Run Flask Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Flask runs at `http://localhost:5005`

### 4. Run React Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs at `http://localhost:3000`

---

## REST API Endpoints

| Method   | Endpoint              | Description               | Sample Payload                                                                                      |
| :------- | :-------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------- |
| `GET`    | `/health`             | API health check          | N/A                                                                                                 |
| `GET`    | `/students`           | Fetch all student records | N/A                                                                                                 |
| `POST`   | `/students`           | Add a new student         | `{"name":"Rahul Sharma","email":"rahul@example.com","phone":"9876543210","course":"DevOps Masterclass"}` |
| `DELETE` | `/students/<id>`      | Delete a student by ID    | N/A                                                                                                 |

---

## Container & Port Reference

| Service  | Container Name     | Internal Port | Published Port |
| :------- | :----------------- | :------------ | :------------- |
| MySQL    | `student_mysql_db` | 3306          | 3306           |
| Backend  | `student_flask_api`| 5005          | 5005           |
| Frontend | `student_react_app`| 80            | 3000           |
