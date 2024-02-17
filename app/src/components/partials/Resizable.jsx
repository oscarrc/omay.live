import { forwardRef, useEffect } from "react";

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
            <span onMouseDown={handleResize} className="handle hidden md:block" />
        </div>
    )
})

export default Resizable;