import express from "express";
import cors from "cors";
import wordExtract, { enhanceQuality } from "./tesseract.js";
import {
  createPuzzle,
  editImage,
  sumOfNumbers,
  wordSearch,
} from "./taskController.js";
const port = 3000;

const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.post("/enhance-image", enhanceQuality);
app.post("/extract-text", wordExtract);
app.post("/add-all-numbers", sumOfNumbers);
app.post("/create-puzzle", createPuzzle);
app.post("/word-search", wordSearch);
app.post("/edit-image", editImage);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
