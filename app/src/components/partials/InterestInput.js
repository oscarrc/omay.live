import{ AiOutlineClose } from "react-icons/ai";

const InterestInput = ({ values, onChange, className }) => {
    const handleTag = (e) => {
        if(!e.target.value.includes(",")) return;
        let added = values
        added.push(e.target.value.replace(",",""))
        e.target.value = "";
        onChange(added)
    }

    const handleRemove = (idx) => {
        const removed = values.filter((v, i) => i !== idx);
        onChange(removed)
    }

    return (
        <div className="group w-full">
            <div className="flex items-center gap-2 border rounded input-lg outline outline-2 outline-base-content/20 outline-offset-2 min-w-1/4">
                {
                    values.map((v,i) => <span key={i} class="badge badge-primary badge-lg">{v} <button onClick={()=>handleRemove(i)}><AiOutlineClose className="ml-1 h-3 w-3" /></button></span> )
                }
                <input onChange={handleTag} type="text" placeholder="Add your interests (Optional)" className={`input focus:outline-none p-0 h-full flex-1 ${className}`} />
            </div>
        </div>
    )
}

export default InterestInput;