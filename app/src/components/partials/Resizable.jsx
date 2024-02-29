import { HiDotsVertical } from "react-icons/hi";
import { forwardRef } from "react";

const Resizable = forwardRef(({ children, className, resizeFunction }, ref) => {
    const handleResize = () => {
        if(!resizeFunction) return;
        document.addEventListener('mousemove', resizeFunction);
        document.addEventListener('touchmove', resizeFunction);
        document.addEventListener("mouseup", stopResize);
        document.addEventListener("touchend", stopResize);
    }

    const stopResize = () => {
        document.removeEventListener('mousemove', resizeFunction);
        document.removeEventListener('touchmove', resizeFunction);
        document.removeEventListener("mouseup", stopResize);
        document.removeEventListener("touchend", stopResize);
    }

    return (
        <div ref={ref} className={`resizable relative ${className}`}>
            { children }
            <span onMouseDown={handleResize} onTouchStart={handleResize} className="handle hidden relative md:block group">
                <HiDotsVertical className="h-5 w-5 my-4 text-base-content/30" />
            </span>
        </div>
    )
})

export default Resizable;