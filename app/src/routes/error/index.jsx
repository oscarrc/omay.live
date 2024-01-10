import { Link, useRouteError } from "react-router-dom";

import Layout from "../../components/layout";
import { useTranslation } from "react-i18next";

const Error = () => {
    const { t } = useTranslation();
    
    return (
        <Layout>
            <div className="flex flex-1 w-full gap-4 items-center justify-center bg-base-100 sm:rounded-lg sm:shadow-inner">
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-xl text-center">{ t("error.errormessage") }</p>
                    <h1 className="text-4xl font-extrabold text-primary relative">{ t("error.unexpectederror") }</h1>
                    <Link to={{ pathname: "/" }} className="btn btn-block btn-primary btn-outline">
                        { t("common.home") }
                    </Link>        
                </div>      
            </div>
        </Layout>
    )
}

export default Error;