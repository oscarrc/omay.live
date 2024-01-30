const Counter = ({ count }) => {
    return (
        <div className="whitespace-nowrap text-primary text-lg font-bold hidden sm:inline">
            <span className="text-2xl">{count}+</span> Online now
        </div>
    )
}

export default Counter;