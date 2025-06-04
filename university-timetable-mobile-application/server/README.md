# University Automated Timetable app backend server
## Get started
1. Install dependencies

   ```bash
   npm install
   ```
2. Create .env file and configure as follows:
   ```bash
   MONGO_URI="mongodb://localhost:27017/timetable_db"
   JWT_SECRET=your_strong_secret_key_here
   FRONTEND_BASE_URL=http://yourIP/localhost:port_number
   NODE_ENV=development
   FRONTEND_PROD_URL = http://yourIP/localhost:port_number
   EMAIL_USER = "__email__"
   EMAIL_PASSWORD = "__email app password__"
   ```
3. Start the backend server

   ```bash
   npm start
   ```