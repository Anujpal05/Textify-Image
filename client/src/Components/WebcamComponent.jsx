import React, { useRef, useState } from 'react'
import Webcam from "react-webcam"
import axios from "axios"
import { RiCameraSwitchFill } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import toast from 'react-hot-toast';


const WebcamComponent = ({ ocrText, setocrText }) => {
  const [screenshot, setscreenshot] = useState(null);
  const [facingMode, setfacingMode] = useState("user");
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 550,
    height: 650,
    facingMode: facingMode
  };

  const captureImg = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setscreenshot(imgSrc);
  }

  const switchCamera = () => {
    setfacingMode(facingMode == "user" ? "environment" : "user");
  }

  const extractText = async () => {
    try {
      const { data: { text } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/extract-text`, { image: screenshot });
      setocrText(text)
      toast.success("Successfully extract text!")
    } catch (error) {
      console.log(error)
      toast.error("Failed to extract text!")
    }
  }

  return (
    <div>
      <div className=' flex  flex-col lg:flex-row items-center gap-2 '>
        <div className=' flex flex-col justify-center gap-1 '>
          <div className=' h-fit w-fit relative border-4 border-black rounded-md'>
            <Webcam
              screenshotFormat='image/jpeg'
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              ref={webcamRef}
            />
            <div className=' absolute bottom-0 bg-gray-800 w-full opacity-50 p-1'>
              <div className=' flex justify-center items-center relative '>
                <button className=' text-gray-100 text-4xl lg:text-6xl hover:opacity-90 outline-none' onClick={captureImg}><FaCamera /></button>
                <button className=' text-gray-100 text-4xl lg:text-5xl absolute right-3 lg:right-5 hover:opacity-90 outline-none' onClick={switchCamera}><RiCameraSwitchFill /></button>
              </div>
            </div>
          </div>
        </div>

        {screenshot && <div className=' flex flex-col justify-center items-center gap-5 '>
          <div className=' relative w-fit h-fit border-4 border-black rounded-md'>
            <img src={screenshot} alt="image" />
            <div className=' absolute bottom-0 text-white w-full'>
              <button className=' text-center w-full p-2 bg-gray-800 text-xl font-semibold border-4 border-black hover:text-[22px] outline-none' onClick={extractText}>Extract Text</button>
            </div>
          </div>
        </div>}
        {ocrText && <div className=' p-2 lg:w-[20%]'>
          <h1 className=' text-xl font-semibold text-center'>Text </h1>
          <p className=' pt-2 font-semibold'>
            {ocrText}
          </p>
        </div>}
      </div>


    </div>
  )
}

export default WebcamComponent
