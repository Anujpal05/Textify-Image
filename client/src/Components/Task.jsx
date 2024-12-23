import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const Task = ({ ocrText }) => {
    const [content, setcontent] = useState({
        array: [],
        errIndexArray: [],
        sum: 0
    })
    const wordRef = useRef("")
    const [state, setstate] = useState();
    const [path, setpath] = useState([])

    const addNumbers = async () => {
        try {
            const { data: { data } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-all-numbers`, { tex: ocrText })
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
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/create-puzzle`, { text: ocrText });
            setcontent({
                array: data.charArray
            })
            toast.success("Created a word puzzle!")
            setstate(3)
        } catch (error) {
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
            toast.error(error?.response?.data?.message || "Something wrong!")
        }
    }



    return (
        <>
            <div className=' p-5'>
                <h1 className=' text-xl lg:text-2xl font-semibold'>PERFORM DIFFERENT TASK</h1>
                <ul className=' font-semibold flex flex-col lg:flex-row gap-2 lg:gap-4  py-3'>
                    <li className=' bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={addNumbers}><button>ADD ALL NUMBERS</button></li>
                    <li className=' bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={() => setstate(2)}><button>EXTRACT TEXT</button></li>
                    <li className=' bg-green-500 w-fit p-1 rounded-md border-2 border-black' onClick={createPuzzle}><button>SOLVE PUZZLE</button></li>
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
            {state == 3 && <div>
                <h1 className=' text-2xl font-semibold text-center underline pb-5'>Result</h1>
                <div className='  lg:p-5 flex flex-col lg:flex-row lg:gap-10 gap-5 '>
                    {content.array && <div className=''>
                        {content.array.map((item, i) => (
                            <div key={i} className='flex'>{item.map((char, j) => (
                                <span key={j}>
                                    {path && !path.some(([x, y]) => x === i && y === j) && <div className=' border-[1px] border-black border-collapse h-10 w-10 flex justify-center items-center font-semibold'>{char}</div>}
                                    {path.some(([x, y]) => x === i && y === j) && <div className=' border-[1px] border-black border-collapse h-10 w-10 flex justify-center items-center font-semibold bg-green-400'>{char}</div>}
                                </span>
                            ))}</div>
                        ))}

                    </div>}
                    <div className=' flex flex-col gap-2 w-fit'>
                        <label className=' text-xl font-semibold'>Enter word to be search :</label>
                        <input type="text" name="word" placeholder="Enter word" id="" className=' border-2 outline-none border-black rounded-md p-1 text-xl ' ref={wordRef} />
                        <div className=' flex justify-center'><button className=' bg-blue-500 p-1 rounded-md text-xl font-semibold outline-none w-fit' onClick={searchWord}>Search</button></div>
                    </div>

                </div>

            </div>}
        </>
    )
}

export default Task
