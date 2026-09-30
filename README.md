# MongoDB setup

The API stores users, tasks, and categories in MongoDB through Mongoose.

## Start locally

1. Install and start MongoDB locally, or create a MongoDB Atlas database.
2. In `server`, copy `.env.example` to `.env` and set `MONGO_URI` to your connection string. Keep `.env` private. Set a unique `JWT_SECRET` as well.
3. In a terminal, run the API:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

   The API listens on `http://localhost:5000` after MongoDB connects. Check `http://localhost:5000/api/health` for database status.
4. In another terminal, run the website:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

Vite prints the local website URL. The frontend calls the API at `http://localhost:5000` by default. To use another API host, set `VITE_API_URL` in the client environment.
