import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";

const Theme = ({ onClick, dark }) => {
    return (
        <button onClick={onClick} aria-label="toggle light/dark theme" className={`btn btn-sm btn-square swap btn-ghost border-base-content/25 ${dark && "swap-active"}`}>
            <LuLightbulb className="h-4 w-4 swap-on"/>
            <LuLightbulbOff className="h-4 w-4 swap-off"/>
        </button>
    )
}

export default Theme