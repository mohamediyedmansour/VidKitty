# 🎥🐱 **VidKitty — The Purrfect Video Downloader API**

### _FastAPI • Docker • Traefik • PostgreSQL • WebSockets • React • Vite_

![Screenshot Placeholder](https://github.com/mohamediyedmansour/VidKitty/blob/main/frontend/public/Screenshot.png?raw=true)

Welcome to **VidKitty**, your elegant, containerized, and authentication-protected video downloader system powered by WebSockets and FastAPI.  
Built for speed, reliability, cuteness, and developer happiness. 😺⚡

---

## 🚀 **Overview**

VidKitty is a full-stack project composed of:

### **Backend (FastAPI 🐍)**

- Secure JWT authentication
- WebSocket real-time download progress
- PostgreSQL database
- Auto-delete temporary files
- Fully containerized with Docker
- Reverse-proxied and SSL-protected via Traefik
- Clean architecture with SQLAlchemy ORM
- Supports high-resolution downloads + subtitles

### **Frontend (React + Vite ⚛️)**

- Authentication system with context
- LocalStorage token handling

### **Infrastructure 🏗️**

- Docker + Docker Compose 🐳
- Traefik 2.11 reverse-proxy
- Automatic HTTPS certificates (ACME Let's Encrypt)
- PostgreSQL 15
- Environment variable-driven config
- Production-ready deployment

---

# 🐾 **Features**

### 📥 **Downloading**

- REST endpoint: `/download`
- WebSocket endpoint: `/ws/download`
- Supports:
  - High-resolution downloads
  - Subtitles
  - Video/Audio type selection
- Real-time status messages through queues

### 📦 **Dockerized Services**

- FastAPI app
- PostgreSQL
- Traefik reverse proxy
- SSL certificates stored in volume
- Environment-driven service configuration

---

# 🗄️ **Database Setup**

```sql
CREATE DATABASE vidkitty;
CREATE USER vidkitty_user WITH PASSWORD 'supersecretpassword';
GRANT ALL PRIVILEGES ON DATABASE vidkitty TO vidkitty_user;
```

---

# 🧩 **Alembic Setup**

```
alembic init alembic
```

Inside `alembic.ini`:

```
sqlalchemy.url = postgresql://vidkitty_user:supersecretpassword@localhost/vidkitty
```

---

# 🧰 **Technologies Used**

### **Backend**

- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic
- PyJWT
- passlib
- WebSockets
- Threading / Queue
- Docker
- Traefik
- Let's Encrypt (ACME)

### **Frontend**

- React
- Vite
- Context API
- LocalStorage Auth

### **DevOps**

- Docker Compose
- Traefik 2.11
- Automatic HTTPS
- Persisted Postgres volumes

---

# 🐱💜 **VidKitty — Built with love, code, and cat energy.**

If you like this project, give it a ⭐ on GitHub or ask for more features!
