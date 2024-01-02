const Toggle = ({ onChange, checked, children }) => {    
   return (
        <label className="cursor-pointer label gap-2 justify-start">
            <input onChange={onChange} type="checkbox" className="toggle toggle-sm toggle-primary" checked={checked} />
            <span className="label-text truncate">{children}</span> 
        </label>
   )
}

export default Toggle