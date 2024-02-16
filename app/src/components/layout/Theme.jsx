import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const Theme = ({ onClick, dark }) => {
    return (
        <button onClick={onClick} className={`btn btn-sm btn-square swap swap-rotate btn-ghost border-base-content/25 ${dark && "swap-active"}`}>
            <IoMoonOutline className="h-4 w-4 swap-on"/>
            <IoSunnyOutline className="h-4 w-4 swap-off"/>
        </button>
    )
}

export default Theme