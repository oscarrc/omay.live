import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-1 w-full gap-4 items-center justify-center bg-base-100 sm:rounded-lg shadow-inner">
            <div className="flex flex-col gap-4">
                <h1 className="text-9xl font-extrabold text-center text-primary tracking-widest relative">
                    404
                    <small className="bg-warning px-2 font-bold text-sm tracking-normal text-white rounded rotate-12 absolute left-1/4 top-1/2">
                        Page Not Found
                    </small>
                </h1>
                <Link to={{ pathname: "/" }} className="btn btn-block btn-primary btn-outline">
                    Home
                </Link>        
            </div>      
        </div>
    )
}

export default NotFound;