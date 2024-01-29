import { Trans, useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

const CookieConsent = ({ show, onSubmit, value }) => {   
    const { t }  = useTranslation();
    const [targeting, setTargeting] = useState(true);
    const dialog = useRef(null);
    
    const setCookieConsent = (e) => {
        e.preventDefault();
        onSubmit({
            targeting
        });
    }

    useEffect(() => {
        show ? dialog?.current.showModal() : dialog.current.close()
    }, [show])

    return (
        <dialog ref={dialog} id="terms" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box min-w-1/3">
                <form method="dialog">
                    <button onClick={setCookieConsent} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg">{t("common.cookies.manage")}</h3>                             
                    <p>           
                        <Trans i18nKey={"common.cookies.message"}>
                            We use cookies to improve your expirence on the site, however you can opt-out. By doing so <strong>you will see ads more frequently</strong> since we won't be able to track whether or not you saw them already.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey={"common.cookies.privacy"}>
                            You can learn more about how we use cookies on our <Link className="btn-link" to={"policies/privacy-policy"}>Privacy Policy</Link>
                        </Trans>
                    </p>
                    <div className="max-w-max">
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2"> 
                                <input type="checkbox" className="toggle" checked disabled readOnly/>
                                <span className="label-text">{t("common.cookies.strictlynecessary")}</span>
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input type="checkbox" className="toggle" onChange={ () => setTargeting(!targeting)} checked={ targeting } />
                                <span className="label-text">{t("common.cookies.targeting")}</span> 
                            </label>
                        </div>
                    </div>
                </div>
                <form onSubmit={setCookieConsent}>
                    <div className="form-control items-end mt-4">                        
                        <button type="submit" className="btn btn-block btn-primary">{t("common.accept")}</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
} 

export default CookieConsent;