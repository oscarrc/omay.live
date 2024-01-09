import { Trans, useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

const AdBlock = () => {
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col flex-1 w-full gap-4 items-center justify-center bg-base-100 sm:rounded-lg shadow-inner">
            <div className="prose md:prose-lg prose-h2:text-xl">
                <h2 className="text-center">{ t("error.adblocker") }</h2>
                <Trans i18nKey="error.disableadblocker">
                    <p>
                        We hope you are enjoying our website. In order to continue using it, we would like to request you to kindly disable your adblocker. Our website is free to use, and the ads displayed on our website help us to cover the costs of running the service. By disabling your adblocker, you will be helping us to keep our website up and running.
                    </p>
                    <p className="font-bold text-center">
                        Thank you for your support!
                    </p>
                </Trans>
                <Link to={{ pathname: "/" }} className="btn btn-block btn-primary btn-outline mt-4">
                    { t("common.home") }
                </Link>  
            </div>  
        </div>
    )
}

export default AdBlock;