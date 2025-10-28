import 'dotenv/config'
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'path' // ✅ ADDED: Import the 'path' module
import { fileURLToPath } from 'url' // ✅ ADDED: Import for ES module scope

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js'
import userRouter from './routes/user.Routes.js'
import PropertiesRouter from './routes/propertiesRoutes.js'
import bookedpropertyRouter from './routes/Bookedccb_res.Routes.js'
import guesthouseRouter from './routes/BookedGuesthouse.Routes.js'
import favoriteRouter from './routes/favorite.Routes.js'
import PropertyOwnerRouter from './routes/BookedPropertyOwner.Routes.js'

// --- App Initialization ---
const app = express()

// ✅ ADDED: Boilerplate to get the correct directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Core Middleware ---
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// ✅ ADDED: Middleware to serve static files from the 'uploads' directory
// This line makes your images accessible via URLs like 'http://<your_server>/uploads/image.jpg'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
const PORT = process.env.PORT || 5000
app.get('/', (req, res) => res.send("api working"))
app.use('/api/auth', authRoutes)
app.use('/api/user', userRouter)
app.use('/api/data-properties', PropertiesRouter)
app.use('/api/booking', bookedpropertyRouter)
app.use('/api/booking', guesthouseRouter)
app.use("/api/favorites", favoriteRouter);
app.use("/api/BookedPropertyOwner", PropertyOwnerRouter);

// --- Database Connection & Server Start ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => console.error('DB connection error:', err));