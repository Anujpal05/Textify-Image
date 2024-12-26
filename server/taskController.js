import sharp from "sharp";
import fs from "fs";
import path from "path";

export const sumOfNumbers = (req, res) => {
  try {
    const { text } = req.body;
    const array = text
      .trim()
      .split(/[,\s;|:\n\t]+/)
      .map((item) => Number(item.trim()));

    let sum = 0;
    let errIndexArray = [];
    array.map((item, i) =>
      !isNaN(item) ? (sum = sum + item) : errIndexArray.push(i)
    );

    return res
      .status(200)
      .json({ success: true, data: { sum, errIndexArray, array } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const createPuzzle = (req, res) => {
  try {
    const { text, targetLength } = req.body;
    const array = text
      .trim()
      .split(/[,s;|:\n\t]+/)
      .map((item) => item.trim());

    const charArray = array.map((item, i) =>
      item
        .split("")
        .map((char) =>
          char.trim() != undefined && char.trim() != null
            ? char.trim().toString().toUpperCase()
            : ""
        )
        .filter((c) => c != "")
    );

    for (let i = 0; i < charArray.length; i++) {
      let innerArray = charArray[i];

      if (innerArray.length < targetLength) {
        while (innerArray.length < targetLength) {
          innerArray.push("-");
        }
      } else if (innerArray.length > targetLength) {
        charArray[i] = innerArray.slice(0, targetLength);
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Word Search successfully!", charArray });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const wordSearch = (req, res) => {
  try {
    const { board, word } = req.body;

    if (board.length == 0 || !word) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required field!",
      });
    }

    let path = [];
    let rows = board.length;
    let cols = board[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (backtrack(board, word, 0, i, j, path)) {
          return res
            .status(200)
            .json({ success: true, message: "Word found!", path });
        }
      }
    }
    return res.status(404).json({ success: false, message: "Word not found!" });
  } catch (error) {
    console.log("error");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const backtrack = (board, word, index, row, col, path) => {
  try {
    if (index == word.length) {
      return true;
    }

    if (!board[row][col] || !word.charAt(index)) {
      return false;
    }

    if (
      row < 0 ||
      row >= board.length ||
      col < 0 ||
      col >= board[0].length ||
      board[row][col].toLowerCase() != word.charAt(index).toLowerCase()
    ) {
      return false;
    }

    let temp = board[row][col];
    board[row][col] = "#";

    path.push([row, col]);

    let found =
      backtrack(board, word, index + 1, row - 1, col, path) ||
      backtrack(board, word, index + 1, row + 1, col, path) ||
      backtrack(board, word, index + 1, row, col - 1, path) ||
      backtrack(board, word, index + 1, row, col + 1, path) ||
      backtrack(board, word, index + 1, row - 1, col + 1, path) ||
      backtrack(board, word, index + 1, row + 1, col - 1, path) ||
      backtrack(board, word, index + 1, row - 1, col - 1, path) ||
      backtrack(board, word, index + 1, row + 1, col + 1, path);

    board[row][col] = temp;

    if (!found) {
      path.pop();
    }
    return found;
  } catch (error) {
    console.log(error);
  }
};

export const editImage = async (req, res) => {
  try {
    const { height, width, quality, image } = req.body;
    const base64Data = image.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    console.log("i am ready");
    const outputDir = "uploads";

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log("ya");
    const outputFilePath = path.join(outputDir, "image.jpg");

    const updatedImg = await sharp(imageBuffer)
      .jpeg({ quality: parseInt(50, 10) })
      .toFile(outputFilePath);

    console.log(updatedImg);
    if (fs.existsSync(outputFilePath)) {
      console.log("file exist!");
      return res
        .status(200)
        .json({
          message: "File path sent successfully!",
          path: outputFilePath,
        });
    } else {
      console.log("File not exist!");
      return res.status(500).json({ message: "File creation failed!" });
    }
  } catch (error) {
    console.error("Compression Error:", error);
    res.status(500).send({ message: "Image compression failed" });
  }
};
