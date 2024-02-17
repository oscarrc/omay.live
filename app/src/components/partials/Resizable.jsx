import { forwardRef, useEffect } from "react";

import { RiExpandLeftRightFill } from "react-icons/ri";

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
                <RiExpandLeftRightFill className="h-4 w-4 absolute top-1/2 text-base-content/20" />
            </span>
        </div>
    )
})

export default Resizable;