

# 🧠 CEREBRO

**An AI-Powered Adaptive Study Planner**

CEREBRO is a full-stack, SDE-grade web application that helps students plan smarter, stay consistent, and avoid burnout using intelligent planning logic and AI agents.
It combines modern frontend design, a scalable backend architecture, and production-ready DevOps practices.

---

## 🚀 Features

### 📅 Smart Study Planning

* Create personalized study plans based on:

  * Subjects
  * Exam date
  * Available daily study hours
* Automatically generates daily tasks with balanced workload distribution

### 🔄 Adaptive Task Management

* Track task status: **pending**, **completed**, **skipped**
* Designed to support future re-planning and rescheduling logic

### 🤖 AI-Ready Architecture

* Modular backend designed for:

  * Planner Agent
  * Productivity/Burnout Agent
  * Revision & Spaced Repetition Agent
* Deterministic planner logic first, AI layered on top (industry best practice)

### 📊 Analytics (Planned)

* Daily & weekly progress tracking
* Completion vs skipped task insights
* Productivity trends

### 🛠️ SDE-Level Engineering

* Clean layered architecture (routes, controllers, services, models)
* RESTful API design
* Cloud-ready database
* CI/CD and Docker support (in progress)

---

## 🧱 Tech Stack

### Frontend

* **React** (Vite)
* **Tailwind CSS**
* Modern dashboard-based UI

### Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* REST APIs with service-layer abstraction

### DevOps & Tooling

* **Git & GitHub**
* **MongoDB Atlas**
* **Docker** (planned)
* **GitHub Actions CI/CD** (planned)

---

## 📁 Project Structure

```
cerebro/
├── client/                # React frontend
│   ├── src/
│   └── ...
├── server/                # Node.js backend
│   ├── src/
│   │   ├── agents/        # AI agents (planner, productivity, revision)
│   │   ├── config/        # DB & environment config
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Core business logic
│   │   ├── middlewares/  # Custom middlewares
│   │   ├── utils/        # Helper utilities
│   │   ├── app.js
│   │   └── server.js
│   └── .env
├── README.md
└── .gitignore
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/cerebro.git
cd cerebro
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

### 3️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

Health check:

```
GET /health
```

---

## 🔌 API Endpoints

### Create Study Plan

```
POST /api/plans
```

```json
{
  "userId": "test-user",
  "subjects": ["DSA", "OS", "DBMS"],
  "examDate": "2026-02-20",
  "dailyHours": 3
}
```

---

### Get All Plans

```
GET /api/plans
```

---

### Get Plan by ID

```
GET /api/plans/:id
```

---

## 🧠 Planner Logic (v1)

* Calculates remaining days until exam
* Distributes daily study time evenly across subjects
* Generates subject-wise tasks for each day
* Stateless, testable service-layer logic

This design allows AI agents to **enhance**, not replace, core logic.

---

## 🧪 Testing (Planned)

* Unit tests for planner service
* API tests for core endpoints
* CI pipeline to block failing builds

---

## 🐳 Docker & CI/CD (Planned)

* Dockerized frontend and backend
* GitHub Actions pipeline:

  * Install dependencies
  * Run tests
  * Build & deploy

---

## 📈 Future Enhancements

* AI-based adaptive re-planning
* Burnout detection & workload adjustment
* Spaced repetition & revision intelligence
* JWT-based authentication
* Real-time progress analytics
* Mobile-responsive UI

---

## 🎯 Why CEREBRO?

CEREBRO is built not just as an app, but as a **real-world SDE project** demonstrating:

* Clean architecture
* Scalable backend design
* Practical AI integration
* DevOps-ready workflows

---

