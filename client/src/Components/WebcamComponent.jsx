import React, { useRef, useState } from 'react'
import Webcam from "react-webcam"
import axios from "axios"

const WebcamComponent = () => {
  const [screenshot, setscreenshot] = useState(null);
  const [facingMode, setfacingMode] = useState("user");
  const [ocrText, setocrText] = useState("")
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 550,
    height: 700,
    facingMode: facingMode
  };

  const captureImg = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setscreenshot(imgSrc);
    console.log(screenshot)
  }

  const switchCamera = () => {
    setfacingMode(facingMode == "user" ? "environment" : "user");
  }

  const extractText = async () => {
    try {
      const { data: { text } } = await axios.post("http://localhost:3000/extract-text", { image: screenshot });
      console.log(text);
      setocrText(text)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className=' flex  flex-col lg:flex-row items-center h-screen gap-2'>
        <div className=' flex flex-col justify-center gap-1 '>
          <Webcam
            screenshotFormat='image/jpeg'
            videoConstraints={videoConstraints}
            screenshotQuality={1}
            ref={webcamRef}
          />
          <div className=' flex flex-col lg:flex-row justify-center items-center gap-1'>
            <button className=" bg-blue-400 text-xl lg:text-3xl font-semibold p-2 rounded-md outline-none border-2 border-black lg:w-[70%]" onClick={captureImg}>Capture Image</button>
            <button className='bg-blue-400 text-xl lg:text-base font-semibold p-2 py-3 rounded-md outline-none border-2 border-black lg:w-[25%] ' onClick={switchCamera}>Switch camera</button>
          </div>
        </div>

        {screenshot && <div className=' flex flex-col justify-center items-center gap-5 pb-20'>
          <img src={screenshot} alt="image" />
          <button className='bg-blue-400 text-xl lg:text-3xl font-semibold p-2 rounded-md outline-none border-2 border-black lg:w-[70%]' onClick={extractText}>Extract Text</button>

        </div>}
        {ocrText && <div className=' p-2'>
          <h1 className=' text-xl font-semibold text-center'>Extract Text </h1>
          <p className=' pt-2 font-semibold'>
            {ocrText}
          </p>
        </div>}
      </div>


    </div>
  )
}

export default WebcamComponent
