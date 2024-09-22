import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import telRouter from "./routes/telRoute.js";
import chatIdMap from './bot.js'; // Import the Telegram bot logic

// app config
const app = express();



const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());

app.use(cors({
  origin: ['https://quickmedpatient.vercel.app', 'https://quickmeddoctor.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/telegram", telRouter);

// Telegram bot chatId lookup endpoint
app.get('/api/chatId/:uniqueCode', (req, res) => {
  const uniqueCode = req.params.uniqueCode;
  const chatId = chatIdMap[uniqueCode];

  if (chatId) {
    res.json({ chatId: chatId });
  } else {
    res.status(404).json({ error: 'Chat ID not found for the given unique code' });
  }
});

// root endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
