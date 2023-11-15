import { useCallback, useEffect, useRef } from "react";

import{ AiOutlineClose } from "react-icons/ai";

const InterestInput = ({ values, onChange, className }) => {
    const inputRef = useRef(null);

    const handleTag = useCallback((e) => {        
        if(e.keyCode !== 13 && e.keyCode !== 188) return;
        else e.preventDefault()
        
        const added = new Set(values);
        added.add(inputRef.current.value.replace(",",""))
        inputRef.current.value = "";
        onChange(Array.from(added))
    },[onChange, values])

    const handleRemove = (idx) => {
        const removed = values.filter((v, i) => i !== idx);
        onChange(removed)
    }

    useEffect(()=>{
        const ref = inputRef.current;
        ref.addEventListener("keydown", handleTag)

        return () => ref.removeEventListener("keydown", handleTag)
    },[handleTag])

    return (
        <div className="group w-full">
            <div className="flex flex-wrap items-center gap-2 border rounded input-lg group-focus:outline outline-2 outline-base-content/20 outline-offset-2 md:max-w-1/4 min-w-1/4 overflow-y-auto overflow-x-hidden py-2">
                {
                    values.map((v,i) => <span key={i} className="badge badge-primary badge-lg">{v} <button onClick={()=>handleRemove(i)}><AiOutlineClose className="ml-1 h-3 w-3" /></button></span> )
                }
                <input ref={inputRef} type="text" placeholder="Add your interests (Optional)" className={`input focus:outline-none p-0 h-full flex-1 ${className}`} />
            </div>
        </div>
    )
}

export default InterestInput;