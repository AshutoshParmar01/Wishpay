import express from "express";
import cors from "cors"
const app = express();
app.use(cors());
app.use(express.json());

import mainRouter from "./routes/index";

app.use("/api/v1", mainRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});