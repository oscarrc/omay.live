import { useCallback, useEffect, useRef } from "react";

import{ AiOutlineClose } from "react-icons/ai";

const TagInput = ({ values, onAdd, onDelete, className, placeholder }) => {
    const inputRef = useRef(null);

    const handleTag = useCallback((e) => {        
        if(e.keyCode !== 13 && e.keyCode !== 188) return;
        else e.preventDefault()
        
        let v = inputRef.current.value.replace(",","");
        v !== "" && onAdd(v)
        inputRef.current.value = "";
    },[onAdd])

    useEffect(()=>{
        const ref = inputRef.current;
        ref.addEventListener("keydown", handleTag)

        return () => ref.removeEventListener("keydown", handleTag)
    },[handleTag])

    return (
        <div className="group w-full">
            <div className={`flex flex-wrap items-center gap-2 border rounded input-lg group-focus:outline outline-2 outline-base-content/20 outline-offset-2 border-base-content/20 scroll overflow-y-auto overflow-x-hidden py-2 ${className}`}>
                {
                    Array.from(values).map((v,i) => <span key={i} className="badge badge-primary badge-lg">{v} <button onClick={()=>onDelete(v)}><AiOutlineClose className="ml-1 h-3 w-3" /></button></span> )
                }
                <input ref={inputRef} type="text" placeholder={placeholder} className={`input focus:outline-none p-0 h-full flex-1 ${className}`} />
            </div>
        </div>
    )
}

export default TagInput;