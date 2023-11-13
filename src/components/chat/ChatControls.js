const ChatControls = ({ onChange, onSubmit, onClick }) => {
    return (
        <div className="join w-full h-16">                   
            <button onClick={onClick} className="join-item btn h-full flex flex-col gap-1 btn-primary w-24 rounded-none sm:rounded-lg">Start <span className="text-base-100 text-xs">Esc</span></button>
            <textarea onChange={onChange} className="join-item flex-1 h-full textarea textarea-bordered textaerea-fixed rounded-none shadow-inner"/>
            <button onSubmit={onSubmit} className="join-item btn h-full flex flex-col gap-1 bg-base-100 w-24 rounded-none sm:rounded-lg">Send <span className="text-primary text-xs">Enter</span></button>
        </div>
    )
}

export default ChatControls;