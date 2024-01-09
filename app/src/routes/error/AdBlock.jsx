import { Link } from "react-router-dom";

const AdBlock = () => {
    return (
        <div className="flex flex-1 w-full gap-4 items-center justify-center bg-base-100 sm:rounded-lg shadow-inner">
            <div className="flex flex-col gap-4 items-center">
                <p className="text-xl text-center">Sorry, we can't let you do that because we have detected that</p>
                <h1 className="text-4xl text-center font-extrabold text-primary relative">
                    YOU ARE USING AD BLOCKER
                </h1>
                <p className="text-xl text-center">Please, disable it and refresh the page</p>
                <Link href="/" className="btn btn-block btn-primary btn-outline">
                    Home
                </Link>        
            </div>      
        </div>
    )
}

export default AdBlock;