import { useState } from 'react'
import './App.css'
import WebcamComponent from './Components/WebcamComponent'
import Task from './Components/Task'
import { Toaster } from 'react-hot-toast';


function App() {
  const [ocrText, setocrText] = useState("")
  return (
    <div className=' bg-blue-100 p-1 min-h-screen '>
      <Toaster />
      <h1 className=' text-2xl lg:text-3xl font-semibold text-center p-5 underline'>Word Search</h1>
      <WebcamComponent ocrText={ocrText} setocrText={setocrText} />
      {ocrText && <Task ocrText={ocrText} />}
    </div>
  )
}

export default App
