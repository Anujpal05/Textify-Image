import express from "express";
import cors from "cors";
import wordExtract from "./tesseract.js";
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/extract-text", wordExtract);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
