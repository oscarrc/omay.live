import { Link, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import { BRAND } from "../../constants/brand";

const Terms = ({ show, mode, onSubmit, onClose }) => {   
    const { t }  = useTranslation();
    const navigate = useNavigate();
    const [ tac, setTac ] = useState(false);
    const [ age, setAge ] = useState(false);
    const dialog = useRef(null);
    
    const acceptAndContinue = (e) => {
        e.preventDefault();
        onSubmit();
        navigate(`/${mode}`)
    }

    useEffect(() => {
        show ? dialog?.current.showModal() : dialog.current.close()
    }, [show])

    return (
        <dialog ref={dialog} id="terms" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box min-w-3/4">
                <form method="dialog">
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <form onSubmit={acceptAndContinue}>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-4 items-start justify-start">
                            <input type="checkbox" checked={tac} onChange={() => setTac(!tac)} className="checkbox" />
                            <span className="label-text text-lg">
                                <Trans i18nKey={"landing.termscheck"}>
                                    By checking the box you acknowledge that you have reviewed an agree to be bound by {{BRAND}}&apos;s <Link target="_blank" rel="noopener noreferrer" className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link>, <Link target="_blank" rel="noopener noreferrer" className="btn-link" to={"policies/privacy-policy"}>Privacy policy</Link> and <Link target="_blank" rel="noopener noreferrer" className="btn-link" to={"policies/community-guidelines"}>Community guidelines</Link>.
                                </Trans>
                            </span> 
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer gap-4 items-start justify-start">
                            <input checked={age} onChange={() => setAge(!age)} type="checkbox" className="checkbox" />
                            <span className="label-text text-lg">                                
                                <Trans i18nKey={"landing.agecheck"}>
                                    You may not use this service if you are under the age of 18 or the age of legal majority in your jurisdiction. See our <Link target="_blank" rel="noopener noreferrer" className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link> for more info. <strong>By checking the box you acknowledge and represent that you are 18 years (or the legal majority in your jurisdiction) or older.</strong>
                                </Trans>
                            </span> 
                        </label>
                    </div>
                    <div className="form-control items-end mt-4">                        
                        <button type="submit" disabled={ !tac || !age } className="btn">{t("landing.acceptandcontinue")}</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
} 

export default Terms;