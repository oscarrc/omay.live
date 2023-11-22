const ChatBox = ({ messages, className }) => {
    return (
        <div className={`bg-base-100 sm:rounded-lg shadow-inner py-2 px-4 ${className}`}>
            {
                messages.map(m => 
                    <p>
                        <strong className={`${ m.me ? "text-primary" : "text-error"} mr-1`}>
                            {m.me ? "You" : "Stranger"}: 
                        </strong>
                        {m.msg}
                    </p>
                )
            }
        </div>
    )
}

export default ChatBox;