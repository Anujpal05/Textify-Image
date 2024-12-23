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
    return res.status(200).json({
      success: true,
      message: "Extract text from image successfully!",
      text,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export default wordExtract;
