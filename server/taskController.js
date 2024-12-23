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
    const { text } = req.body;
    const array = text
      .trim()
      .split(/[,s;|:\n\t]+/)
      .map((item) => item.trim());

    const charArray = array.map((item, i) => item.split(""));
    return res
      .status(200)
      .json({ success: true, message: "Word Search successfully!", charArray });
  } catch (error) {
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const backtrack = (board, word, index, row, col, path) => {
  if (index == word.length) {
    return true;
  }

  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col] != word.charAt(index)
  ) {
    return false;
  }

  let temp = board[row][col];
  board[row][col] = "#";

  let found =
    backtrack(board, word, index + 1, row, col + 1, path) ||
    backtrack(board, word, index + 1, row + 1, col, path) ||
    backtrack(board, word, index + 1, row - 1, col, path) ||
    backtrack(board, word, index + 1, row, col - 1, path) ||
    backtrack(board, word, index + 1, row - 1, col - 1, path) ||
    backtrack(board, word, index + 1, row + 1, col + 1, path) ||
    backtrack(board, word, index + 1, row + 1, col - 1, path) ||
    backtrack(board, word, index + 1, row - 1, col + 1, path);

  board[row][col] = temp;
  if (found) {
    console.log("row : ", row, "column :", col, "word : ", word.charAt(index));
    path.push([row, col]);
  }
  return found;
};
