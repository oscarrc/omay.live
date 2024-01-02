const Loader = ({ className }) => {
    return (
        <div className={`flex flex-1 w-full items-center justify-center ${className}`}>
            <span class="loading loading-ring loading-lg text-primary"></span>
        </div>
    )
}

export default Loader;