import { forwardRef, useEffect } from "react";

import { HiDotsVertical } from "react-icons/hi";

const Resizable = forwardRef(({ children, className, resizeFunction }, ref) => {
    const handleResize = () => {
        resizeFunction && document.addEventListener('mousemove', resizeFunction);
    }

    const stopResize = () => {
        resizeFunction && document.removeEventListener('mousemove', resizeFunction);
    }

    useEffect(() => {
        document.addEventListener("mouseup", stopResize)
    })
    
    return (
        <div ref={ref} className={`resizable relative ${className}`}>
            { children }
            <span onMouseDown={handleResize} className="handle hidden relative md:block group">
                <HiDotsVertical className="h-4 w-4 my-4 top-1/2 text-base-content/30" />
            </span>
        </div>
    )
})

export default Resizable;