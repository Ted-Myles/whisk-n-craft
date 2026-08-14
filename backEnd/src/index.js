import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});