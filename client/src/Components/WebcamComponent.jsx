import React, { useEffect, useMemo, useRef, useState } from 'react'
import Webcam from "react-webcam"
import axios from "axios"
import { RiCameraSwitchFill } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import toast from 'react-hot-toast';
import { IoMdDownload } from "react-icons/io";


const WebcamComponent = ({ ocrText, setocrText }) => {
  const [screenshot, setscreenshot] = useState(null);
  const [qualityImg, setqualityImg] = useState(null)
  const [facingMode, setfacingMode] = useState("user");
  const [isCameraAccessible, setisCameraAccessible] = useState(true);
  const [type, settype] = useState("Scanner");
  const [loading, setloading] = useState(false)
  const [state, setstate] = useState(0);
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 550,
    height: 650,
    facingMode: facingMode
  };

  useEffect(() => {
    setscreenshot(null);
    setqualityImg(null);
    setocrText('')
    setstate(0);
  }, [type])


  //Capture Image
  const captureImg = async () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setscreenshot(imgSrc);
  }

  //Switch Camera
  const switchCamera = () => {
    setfacingMode(facingMode == "user" ? "environment" : "user");
  }

  //Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      convertToBase64(file)
      toast.success("Image uploaded successfully!")
    } else {
      toast.error("Please provide valid image type!")
    }
  }

  //Enhance Image Quality
  useEffect(() => {
    const fetch = async () => {
      if (screenshot) {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/enhance-image`, { image: screenshot });
        setqualityImg(`data:image/jpeg;base64,${data.qualityImg}`)
      }
    }

    if (screenshot) {
      fetch();
    }
  }, [screenshot])



  //Convert To Base 64
  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setscreenshot(reader.result);
    }
    reader.readAsDataURL(file);
  }


  //Call When camera is accessible
  const handleVideoStart = () => {
    setisCameraAccessible(true);
  }


  //Call When camera is not accessible
  const handleVideoStop = () => {
    setisCameraAccessible(false)
  }

  //Extracting Text from Image
  const extractText = async (image, index) => {
    try {
      setloading(true)
      setstate(index)
      const { data: { text } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/extract-text`, { image });
      setocrText(text)
      setloading(false)
      toast.success("Successfully extract text!")
    } catch (error) {
      console.log(error)
      toast.error("Failed to extract text!")
    }
  }

  const downloadImg = (imageUrl) => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "image.png";
      link.click();
      toast.success("Image downloaded successfully!")
    } else {
      toast.error("Please select Image to be download!")
    }
  }

  return (
    <div>
      <div className=' flex flex-col items-center justify-center p-2 lg:p-5'>
        <h1 className=' font-semibold lg:text-xl text-lg'>Choose an option to upload an image : </h1>
        <div className=' flex items-center gap-4 font-semibold'>

          <div className=' relative group flex flex-row lg:flex-col justify-center items-center'>
            <div className=' space-x-1 flex items-center  px-2 ' onClick={() => settype("Scanner")}>
              <input type="radio" name="uploadOption" className=' cursor-pointer outline-none' id="scanner" />
              <label htmlFor="scanner">Scanner</label>
            </div>
            <span className='absolute top-5 left-14  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white'>Scanner</span>
          </div>


          <div className=' relative group flex flex-row lg:flex-col justify-center items-center'>
            <div className=' space-x-1 flex items-center px-2' onClick={() => settype("File")}>
              <input type="radio" name="uploadOption" className=' cursor-pointer outline-none' id="file" />
              <label htmlFor="file">File</label>
            </div>
            <span className='absolute top-5 left-10  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white w-24 text-center'>Select Image File</span>
          </div>
        </div>
      </div>

      {/* File Option */}
      {type == "File" && <div className=' flex justify-center items-center pb-5'>
        <input type="file" accept='image/*' name='image' onChange={(e) => handleFileChange(e)} />
      </div>}

      <div className=' flex  flex-col lg:flex-row items-center gap-2 '>
        {/* Render when camera is accessible */}
        {isCameraAccessible && type == "Scanner" && <div className=' flex flex-col justify-center gap-1 '>
          <div className=' h-fit w-fit relative border-4 border-black rounded-md'>
            <Webcam
              screenshotFormat='image/jpeg'
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              ref={webcamRef}
              onUserMedia={handleVideoStart}
              onUserMediaError={handleVideoStop}
            />
            <div className=' absolute bottom-0 bg-gray-800 w-full opacity-50 p-1'>
              <div className=' flex justify-center items-center relative '>
                <div className=' group  top-3 right-3  text-blue-500 flex flex-row lg:flex-col justify-center items-center'>
                  <button className=' text-gray-100 text-4xl lg:text-6xl hover:opacity-90 outline-none' onClick={captureImg}><FaCamera /></button>
                  <span className='absolute top-16 opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white'>Capture Image</span>
                </div>

                <div className=' group top-3 right-3 text-blue-500 flex flex-row lg:flex-col justify-center items-center'>
                  <button className=' text-gray-100 text-4xl lg:text-5xl absolute right-3 lg:right-5 hover:opacity-90 outline-none' onClick={switchCamera}><RiCameraSwitchFill /></button>
                  <span className='absolute top-16 right-2  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white'>Switch Camera</span>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* Render when camera is not accessible */}
        {
          !isCameraAccessible && type == "Scanner" && <div className=' text-red-700 text-xl font-semibold flex flex-col justify-center items-center w-full'>
            <h1>Camera not accessible</h1>
            <p>Please enable the camera to proceed.</p>
          </div>
        }

        {/* Actual Image given by user */}
        {screenshot && <div className=' flex flex-col justify-center items-center gap-5 '>
          <div className=' relative w-fit h-fit border-4 border-black rounded-md  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg max-h-[650px]'>
            <img src={screenshot} alt="image" className=' h-[650px] w-[550px] ' />
            <div className=' group absolute bottom-0 flex justify-center text-white w-full'>
              <button className=' text-center w-full p-2 bg-gray-800 text-xl font-semibold border-4 flex justify-center items-center gap-2 border-black hover:text-[22px] outline-none' onClick={() => extractText(screenshot, 1)}>Extract Text {loading && state == 1 && <span className=' border-l-2 border-b-2 animate-spin block border-white rounded-full h-5 w-5'></span>} </button>
              <span className='absolute top-12  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Extract Text</span>
            </div>
            <div className=' group absolute top-3 right-3 text-blue-500 flex flex-row lg:flex-col justify-center items-center'>
              <button className=' outline-none text-3xl lg:text-4xl order-2 lg:order-1' onClick={() => downloadImg(screenshot)}><IoMdDownload /></button>
              <span className='opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white'>Download Image 1</span>
            </div>
          </div>
        </div>}

        {/* Better Quality Image */}
        {qualityImg && <div className=' flex flex-col justify-center items-center gap-5 '>
          <div className=' relative w-fit h-fit border-4 border-black rounded-md'>
            <img src={qualityImg} alt="image" />
            <div className=' group absolute bottom-0 flex justify-center text-white w-full'>
              <button className=' text-center w-full p-2 bg-gray-800 text-xl font-semibold border-4 flex justify-center items-center gap-2 border-black hover:text-[22px] outline-none' onClick={() => extractText(qualityImg, 2)}>Extract Text {loading && state == 2 && <span className=' border-l-2 border-b-2 animate-spin block border-white rounded-full h-5 w-5'></span>} </button>
              <span className='absolute top-12  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Extract Text</span>
            </div>
            <div className=' group absolute top-3 right-3  text-blue-500 flex flex-row lg:flex-col justify-center items-center'>
              <button className=' outline-none text-3xl lg:text-4xl order-2 lg:order-1' onClick={() => downloadImg(qualityImg)}><IoMdDownload /></button>
              <span className='opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[12px] shadow-md shadow-black h-fit text-white'>Download Image 2</span>
            </div>
          </div>
        </div>}

        {/* Extracted Text */}
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
