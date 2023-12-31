import { useEffect, useState } from "react"

const useMouseMoving = () => {
    const [ isMouseMoving, setIsMoving ] = useState(true);

    useEffect(() => {
        let timer = setTimeout(() => setIsMoving(false), 1000);

        const handleMove = () => {
            clearTimeout(timer); 
            setIsMoving(true)
            timer = setTimeout(() => setIsMoving(false), 500)
        }

        document.addEventListener("mousemove", handleMove)

        return () => {            
            clearTimeout(timer); 
            document.removeEventListener("mousemove", handleMove)
        }
    }, [])

    return isMouseMoving;
}

export default useMouseMoving;