# Deployment Documentation

Civifix can be deployed either using Docker containers (recommended for staging/production) or directly on bare metal processes.

## 1. Containerized Deployment (Docker)

The project includes a `Dockerfile` and `docker-compose.yml` in the `/Backend` directory to spin up the API and MongoDB together.

### Backend Dockerfile (`/Backend/Dockerfile`)
The backend container definition uses a multi-stage-like approach on Python 3.10-slim:
```dockerfile
FROM python:3.10-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (`/Backend/docker-compose.yml`)
The Docker Compose file orchestrates two services: `web` (FastAPI) and `db` (MongoDB).
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./app:/code/app
      - ./uploads:/code/uploads
    environment:
      - ENV=development
      - MONGODB_URL=mongodb://root:mongo_password@db:27017/civifix_db?authSource=admin
      - DATABASE_NAME=civifix_db
      - JWT_SECRET_KEY=dev-secret-key-change-in-prod-12345
      - JWT_REFRESH_SECRET=dev-refresh-secret-change-in-prod-12345
      - SMTP_HOST=smtp.gmail.com
      - SMTP_PORT=587
      - SMTP_USERNAME=your-email@gmail.com
      - SMTP_PASSWORD=your-app-password
      - SENDER_EMAIL=noreply@civifix.in
    depends_on:
      - db

  db:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=mongo_password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Commands to Run:
```bash
cd Backend
docker-compose up -d --build
```

---

## 2. Production Considerations

1.  **SSL/TLS (HTTPS)**:
    *   Place a reverse proxy (e.g., Nginx, Traefik, or AWS ALB) in front of the FastAPI backend to terminate SSL.
    *   Configure SSL certificates using Let's Encrypt or ACM.
2.  **FastAPI ASGI Server Configuration**:
    *   For production, run uvicorn with multiple workers or use gunicorn as a process manager:
        `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000`
3.  **Next.js Frontend Deployment**:
    *   Deploy Next.js on Vercel, Netlify, or self-host using Docker/Node.js server.
    *   Set environment variables `NEXT_PUBLIC_API_URL` pointing to the secure backend domain.
4.  **Database Scalability**:
    *   Migrate from single-instance container MongoDB to MongoDB Atlas (managed cloud service) with replica sets enabled.
5.  **SMTP Configuration**:
    *   Use a reliable transaction email service (like SendGrid, Mailgun, Amazon SES) instead of Gmail SMTP.
