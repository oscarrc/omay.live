const Toggle = ({ onChange, checked, children }) => {    
   return (
        <label className="cursor-pointer label gap-2 justify-start items-end">
            <input onChange={onChange} type="checkbox" className="toggle toggle-sm toggle-primary" checked={checked} />
            <span className="label-text break-all truncate">{children}</span> 
        </label>
   )
}

export default Toggle