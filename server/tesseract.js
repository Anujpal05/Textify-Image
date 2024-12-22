// import Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

// Tesseract.recognize(
//   "https://sciencenotes.org/wp-content/uploads/2018/10/TreesWordSearch.png",
//   "eng",
//   { logger: (m) => console.log(m) }
// )
//   .then((data) => {
//     console.log(
//     );
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const wordExtract = async (req, res) => {
  try {
    const { image } = req.body;
    const worker = await createWorker("eng");
    console.log("Recognize...");
    const {
      data: { text },
    } = await worker.recognize(image);

    await worker.terminate();
    const result = formatText(text);

    return res.status(200).json({
      success: true,
      message: "Extract text from image successfully!",
      text: array,
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const formatText = (text) => {
  const array = text
    .trim()
    .split(/[,\s;|:\n\t]+/)
    .map((item) => Number(item.trim()));

  let sum = 0;
  let errIndexArray = [];
  array.map((item, i) =>
    !isNaN(item) ? (sum = sum + item) : errIndexArray.push(i)
  );

  return { sum, errIndexArray, array };
};

export default wordExtract;
