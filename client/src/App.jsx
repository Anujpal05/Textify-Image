import { useState } from 'react'
import './App.css'
import WebcamComponent from './Components/WebcamComponent'
import Task from './Components/Task'
import { Toaster } from 'react-hot-toast';


function App() {
  const [ocrText, setocrText] = useState("")
  const [imageInfo, setimageInfo] = useState({
    quality: 100,
    width: "",
    height: "",
    image: ""
  })

  return (
    <div className=' bg-gray-800 p-1 min-h-screen pb-20 bg-[url("./assets/img.jpg")] bg-cover text-white overflow-hidden '>
      <Toaster />
      <h1 className=' text-2xl lg:text-3xl font-semibold text-center p-5 underline'>Word Search</h1>
      <WebcamComponent ocrText={ocrText} setocrText={setocrText} imageInfo={imageInfo} setimageInfo={setimageInfo} />
      {ocrText && <Task ocrText={ocrText} imageInfo={imageInfo} setimageInfo={setimageInfo} />}
    </div>
  )
}

export default App
