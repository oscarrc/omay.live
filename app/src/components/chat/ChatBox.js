const ChatBox = ({ messages, className }) => {
    return (
        <div className={`bg-base-100 sm:rounded-lg shadow-inner ${className}`}>
            {
                messages.map(m => 
                    <p>{m.me ? "Me" : "Stranger"}: {m.msg}</p>
                )
            }
        </div>
    )
}

export default ChatBox;