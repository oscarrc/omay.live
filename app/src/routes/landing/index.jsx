import { Ad, AdAlt, Alert, InterestInput } from "../../components/partials";
import { BRAND, TRANSLITERATION } from "../../constants/brand";
import { Trans, useTranslation } from 'react-i18next';

import ADS from "../../constants/ads";
import { AiFillWarning } from "react-icons/ai";
import { FaBan } from "react-icons/fa";
import { IoHandRight } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Terms } from "../../components/modals";
import { useAdblockDetection } from "../../hooks/useAdblockDetection";
import { useChat } from "../../hooks/useChat";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useDevice } from "../../hooks/useDevice";
import { useEffect } from "react";

const Landing = () => {     
    const { state: { tac, mode, interests }, dispatch, isBanned } = useChat();
    const { t } = useTranslation();
    const { isMobile } = useDevice();
    const { cookieConsent: { targeting } } = useCookieConsent();
    const hasAdblock = useAdblockDetection();
    
    useEffect(()=> {
        dispatch({type: "RESET"})
    }, [dispatch]);

    return (
        <>
            <section className="flex flex-col gap-4 justify-center items-center flex-col flex-1 w-full bg-base-100 rounded sm:shadow-inner p-8">
                {
                    targeting && 
                        <>
                        <Ad 
                            className="responsive" 
                            zoneId={ADS.banner.moderated[isMobile ? "mobile" : "desktop"]} 
                            keywords={Array.from(interests)} 
                        />
                        </>
                }        
                <div className="flex flex-col gap-8">
                    {
                        (!targeting || hasAdblock) &&
                            <AdAlt 
                                className="responsive justify-center" 
                                zoneId={ADS.banner.moderated[isMobile ? "mobile" : "desktop"]} 
                            >
                                <Alert 
                                    title={t("common.alerts.adblockdetected")}
                                    text={t("common.alerts.disableadblock")}
                                    icon={<IoHandRight className="text-neutral" />  }
                                    color="warning"
                                /> 
                            </AdAlt>
                            
                    }
                    <div className="prose md:prose-lg min-w-fit prose-h2:text-xl">
                        <h2 className="text-center">
                            <Trans i18nKey="landing.noapp">
                                You don't need an app to use {{ BRAND }} on your phone or tablet! The web site works great on mobile.
                            </Trans>
                        </h2>
                        <p>
                            <Trans i18nKey="landing.intro">
                                {{BRAND}} ({{TRANSLITERATION}}) is a great way to meet new friends. When you use {{ BRAND }}, we pick someone else at random and let you talk one-to-one. To help you stay safe, chats are anonymous unless you tell someone who you are (not recommended!), and you can stop a chat any time. See our  <Link className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link>, and <Link className="btn-link" to={"policies/community-guidelines"}>Community guidelines</Link> for info about de do's and don'ts in using { BRAND }. { BRAND } video chat is AI moderated but no moderation is perfects. Users are solely responsible for their behaviour while using {{ BRAND }}
                            </Trans>
                        </p>
                        <p>
                            <Trans i18nKey="landing.disclaimer">
                                <strong>You must be 18 (or the legal majority in your jurisdiction) or older to use {{BRAND}}</strong>. See {{BRAND}}&apos; <Link className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link> for more info. Parental control protections that may assists parents are commercially available and you can find more info at <a className="btn-link" href="https://www.connectsafely.org/controls" target="_blank" rel="noopener noreferrer" >https://www.connectsafely.org/controls</a> as well are other sites.
                            </Trans>
                        </p>
                        <p>
                            <Trans i18nKey="landing.pleaseleave">
                                Please leave {{ BRAND }} and visit an adult site instead if that's what you are looking for and you are 18 (or the legal majority in your jurisdiction) or older.
                            </Trans>
                        </p>
                    </div>
                    
                    {
                        isBanned ?
                            <Alert 
                                title={t("common.alerts.banned")}
                                text={t("common.alerts.banreason")}
                                icon={<FaBan className="text-error h-8 w-8 hidden sm:block" />  }
                                color=""
                            /> :
                            <Alert 
                                title={t("common.alerts.monitored")}
                                text={t("common.alerts.keepclean")}
                                icon={<AiFillWarning className="text-warning" />  }
                                color="primary"
                            />
                    }

                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex flex-col gap-3 items-center">
                            <span>{ t("common.talkabout") }</span>
                            <InterestInput
                                values={interests} 
                                onAdd={(i) => dispatch({type: "ADD_INTEREST", payload: i})}
                                onDelete={(i) => dispatch({type: "DEL_INTEREST", payload: i})}
                                className="md:max-w-1/4 min-w-1/4"
                            />
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <h4 className="text-lg font-bold">{ t("common.startchatting") }</h4>
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto">
                                <button disabled={isBanned} onClick={()=>dispatch({type: "MODE", payload: "text"})} className="btn btn-lg btn-primary w-full sm:w-40">{ t("common.text") }</button>
                                <div className="divider sm:divider-horizontal uppercase">{ t("common.or") }</div>
                                <div className="flex flex-col gap-2">
                                    <button disabled={isBanned} onClick={()=>dispatch({type: "MODE", payload: "video"})} className="btn btn-lg btn-primary w-full sm:w-40">{ t("common.video") }</button>
                                    <button disabled={isBanned} onClick={()=>dispatch({type: "MODE", payload: "unmoderated"})} className="btn btn-xs text-xs w-full sm:w-40 sm:self-end h-fit">{ t("common.unmoderated") }</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </section>
            <Terms show={ mode && !tac } mode={mode} onClose={()=>dispatch({type: "RESET"})} onSubmit={()=>dispatch({type: "TAC", payload: true})} />
        </>
    )
}

export default Landing;