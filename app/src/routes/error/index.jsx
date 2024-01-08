import { Link, useRouteError } from "react-router-dom";

import Layout from "../../components/layout";

const Error = () => {
    return (
        <Layout>
            <div className="flex flex-1 w-full gap-4 items-center justify-center bg-base-100 sm:rounded-lg shadow-inner">
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-xl text-center">This is embarrasing... There has been an</p>
                    <h1 className="text-4xl font-extrabold text-primary relative">
                        UNEXPECTED ERROR
                    </h1>
                    <Link href="/" className="btn btn-block btn-primary btn-outline">
                        Home
                    </Link>        
                </div>      
            </div>
        </Layout>
    )
}

export default Error;