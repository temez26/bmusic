# 🎵 BMUSIC

This is a web app for local music streaming.

## 🚀 Technologies Used

### **Frontend**

- [Angular](bmusic-ui/)
- [Material Design Components](bmusic-ui/src/app/navbar/navbar.component.ts)

### **Backend**

- [Node.js](bmusic-api/main.js)
- [Express.js Controllers](bmusic-api/services/uploadController.js)

### **Database**

- [PostgreSQL Schema](database/V1___initial_schema.sql)

### **Storage**

- Local machine storage for music files ([bmusic-api/data/uploads/](bmusic-api/data/uploads/))

## 🛠️ Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/bmusic.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd bmusic
   ```
3. **Set up environment variables**

   - Copy `project.env` to `.env` and configure as needed.

4. **Start Docker containers**

- dev
  ```sh
  docker-compose up
  ```
- prod
  ```sh
   docker compose -f docker-compose.prod.yml up --build -d
  ```
