// import Tesseract from "tesseract.js";
import sharp from "sharp";
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

export const enhanceQuality = async (req, res) => {
  try {
    const { image } = req.body;
    const bash64Data = image.split(",")[1];

    const imageBuffer = Buffer.from(bash64Data, "base64");
    const qualityImg = (
      await sharp(imageBuffer)
        .resize({ width: 550, height: 650, fit: "inside" })
        .grayscale()
        .threshold(128)
        .toBuffer()
    ).toString("base64");

    return res
      .status(200)
      .json({ success: true, message: "Improve Image Quality!", qualityImg });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export default wordExtract;
