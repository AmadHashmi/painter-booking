# 🎨 Adam Painter Booking App

A full-stack web application that allows clients to book painters based on their availability.

---

## 📦 Project Structure

```console
adam-painter-booking/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db            # SQLite database
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md 
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```console
git clone <your-repo-url>
cd adam-painter-booking
```

---

## 🖥️ Backend Setup

```console
cd backend
```

### 🔧 Install Dependencies

```console
npm install
```

### 🔌 Setup Prisma

```console
npx prisma generate
```

> The \`dev.db\` file is already included. No migration needed unless you change the schema.

### ▶️ Run the Server

```console
npm run dev
```

The backend runs at [http://localhost:4000](http://localhost:4000)

### 🧪 Optional: View DB in Prisma Studio

```console
npx prisma studio
```

---

## 🌐 Frontend Setup

```console
cd frontend
```

### 📦 Install Dependencies

```console
npm install
```

### ▶️ Start Frontend Server

```console
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173)

---

## 🧪 Test Users

You can register users as either:

- \`Painter\`
- \`Client\`

Each user has a separate dashboard and functionality.

---

## 🔁 Useful Commands

| Command                          | Description                         |
|----------------------------------|-------------------------------------|
| \`npm run dev\` (frontend/backend) | Starts frontend/backend in dev mode |
| \`npx prisma generate\`            | Generates Prisma client             |
| \`npx prisma studio\`              | GUI for DB                          |
| \`npx prisma migrate reset\`       | Reset DB (optional)                 |

---

## ✅ Features Implemented

- 🔐 JWT-based auth (register/login)
- 🎯 Painters can:
  - Set availability
  - See bookings
  - Delete availability if no bookings exist
- 📆 Clients can:
  - View available slots
  - Book a painter
  - Cancel confirmed bookings
- ❌ Prevents:
  - Duplicate availabilities
  - Overlapping bookings
  - Availability deletion if painter has bookings

---

## 💡 Tips

- You can delete and reset the DB easily with:

```console
npx prisma migrate reset
```

- Backend \`.env\` file:

```console
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_jwt_secret"
```

---

