import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const Task = ({ ocrText }) => {
    const [content, setcontent] = useState({
        array: [],
        errIndexArray: [],
        sum: 0
    })
    const wordRef = useRef("");
    const targetRef = useRef(null)
    const [state, setstate] = useState();
    const [path, setpath] = useState([]);
    let targetArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const addNumbers = async () => {
        try {
            const { data: { data } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-all-numbers`, { text: ocrText })
            setcontent({
                array: data.array,
                errIndexArray: data.errIndexArray,
                sum: data.sum
            })
            setstate(1)
            toast.success("All numbers added successfully!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Wrong!")
        }
    }

    const createPuzzle = async () => {
        try {
            console.log(targetRef)
            const targetLength = targetRef.current.value;
            console.log(targetLength)
            console.log(ocrText)
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/create-puzzle`, { text: ocrText, targetLength });
            setcontent({
                array: data.charArray
            })

            toast.success("Created a word puzzle!")
            setstate(3)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something wrong!")
        }
    }

    const searchWord = async () => {
        try {
            const word = wordRef.current.value;
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/word-search`, { board: content.array, word });
            if (data.success) {
                setpath(data.path);
                toast.success("Word found!")
            } else {
                setpath([])
                toast.error("Word not found!")
            }

        } catch (error) {
            setpath([])
            toast.error(error?.response?.data?.message || "Something wrong!")
        }
    }



    return (
        <>
            <div className=' p-2 lg:p-5'>
                <h1 className=' text-xl lg:text-2xl font-semibold'>PERFORM DIFFERENT TASK</h1>
                <ul className=' font-semibold flex flex-col lg:flex-row gap-2 lg:gap-4  py-3'>
                    <li className='relative group bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={addNumbers}>
                        <div className=' group bottom-0 flex justify-center w-full'>
                            <button className=' outline-none'>ADD ALL NUMBERS</button>
                            <span className='absolute top-9  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Add All Numbers</span>
                        </div>
                    </li>
                    <li className='relative bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={() => setstate(2)}>
                        <div className=' group bottom-0 flex justify-center w-full'>
                            <button className=' outline-none'>EXTRACT TEXT</button>
                            <span className='absolute top-9  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Extract text</span>
                        </div>
                    </li>
                    <li className='relative bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={createPuzzle}>
                        <div className='  group bottom-0 flex justify-center w-full'>
                            <button className=' outline-none'>CREATE PUZZLE</button>
                            <span className='absolute top-9  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Create puzzle</span>
                        </div>
                    </li>
                    <li>
                        <div className='relative  group bottom-0 flex justify-center w-full'>
                            <select defaultValue={10} name="targetValue" id="" ref={targetRef} className='  w-11 h-9 outline-none border-black border-2 rounded-md'>
                                {targetArray.map(i => (
                                    <option value={i} key={i}>{i}</option>
                                ))}
                            </select>
                            <span className='absolute top-9  opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white w-20 text-center'>No. Of Row</span>
                        </div>
                    </li>
                </ul>
            </div>
            {state == 1 && <div className=' p-3'>
                <h1 className=' text-2xl font-semibold text-center underline pb-5'>Result</h1>
                <div className=' grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-4'>
                    <div>
                        <h1 className=' text-xl font-semibold'>Text :</h1>
                        <p>
                            {ocrText ? ocrText : null}
                        </p>
                    </div>
                    <div>
                        <h1 className=' text-xl font-semibold'>Numbers :</h1>
                        {content.array.length > 0 && <div className=' font-semibold'>{content.array.map((item, i) => (
                            <ul key={i}>
                                <li>{i + 1} : {item ? item : "Error"}</li>
                            </ul>
                        ))}
                        </div>}
                        {content.array.length == 0 && <div>
                            No Any Number exist!
                        </div>}
                    </div>
                    <div>
                        <h1 className=' text-xl font-semibold'>Sum :</h1>
                        <p>{content.sum}</p>
                    </div>
                </div>
            </div>}
            {state == 2 && <div className=' p-3'>
                <h1 className=' text-2xl font-semibold text-center underline pb-5'>Result</h1>
                <h1 className=' text-xl font-semibold'>Text :</h1>
                <p className=' font-semibold'>{ocrText}</p>
            </div>}
            {state == 3 && <div className=' '>
                <h1 className=' text-2xl font-semibold text-center underline pb-5'>Result</h1>
                <div className='  lg:p-5 flex flex-col md:justify-center md:items-center lg:flex-row lg:gap-10 gap-5 '>
                    {content.array && <div className=' overflow-x-scroll md:overflow-visible  pb-2'>
                        {content.array.map((item, i) => (
                            <div key={i} className='flex '>{item.map((char, j) => (
                                <span key={j}>
                                    {path && !path.some(([x, y]) => x === i && y === j) && <div className=' border-[1px] border-black border-collapse h-6 w-6 text-[14px] md:text-xl md:h-10 md:w-10 flex justify-center items-center font-semibold'>{char}</div>}
                                    {path.some(([x, y]) => x === i && y === j) && <div className=' border-[1px] border-black border-collapse h-6 w-6 text-[14px] md:text-xl md:h-10 md:w-10 flex justify-center items-center font-semibold bg-green-400'>{char}</div>}
                                </span>
                            ))}</div>
                        ))}

                    </div>}
                    <div className=' lg:flex-none flex justify-center items-center '>
                        <div className=' flex flex-col gap-2 w-fit pb-20'>
                            <label className=' text-lg lg:text-xl font-semibold'>Enter word to be search :</label>
                            <div className=' space-x-1'>
                                <input type="text" name="word" placeholder="Enter word" id="" className=' border-2 outline-none border-black rounded-md p-[2px] px-2 lg:p-1 text-lg lg:text-xl ' ref={wordRef} />
                            </div>
                            <div className=' flex justify-center'>

                                <div className=' relative group bottom-0 flex justify-center w-full'>
                                    <button className=' bg-blue-500 p-1 rounded-md text-lg lg:text-xl font-semibold outline-none w-fit' onClick={searchWord}>Search</button>
                                    <span className='absolute top-9 opacity-0 group-hover:opacity-100 bg-black p-1 m-[2px] order-1 lg:order-2 font-semibold transition-all duration-300 ease-in z-40 text-[14px] shadow-md shadow-black h-fit text-white'>Search word</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>}
        </>
    )
}

export default Task
