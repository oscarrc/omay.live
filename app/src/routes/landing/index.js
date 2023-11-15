import { Alert, InterestInput } from "../../components/partials";
import { BRAND, TRANSLITERATION } from "../../constants/strings";

import { AiFillWarning } from "react-icons/ai";
import { FaBan } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Terms } from "../../components/modals";
import { useChat } from "../../hooks/useChat";
import { useEffect } from "react";

const Landing = () => {     
    const { state: { tac, mode }, dispatch, interests, setInterests } = useChat();
    
    useEffect(()=> {
        dispatch({type: "RESET"})
    }, [dispatch]);

    return (
        <>
            <section className="flex gap-4 justify-center items-center flex-col flex-1 w-full bg-base-100 rounded shadow-inner p-8">
                <div className="flex flex-col gap-8">
                    <div className="prose md:prose-lg min-w-fit">
                        <h4 className="text-center">You don't need an app to use { BRAND } on your phone or tablet! The web site works great on mobile.</h4>
                        <p>{BRAND} ({TRANSLITERATION}) is a great way to meet new friends. When you use { BRAND }, we pick someone else at random and let you talk one-to-one. To help you stay safe, chats are anonymous unless you tell someone who you are (not recommended!), and you can stop a chat any time. See our  <Link className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link>, and <Link className="btn-link" to={"policies/community-guidelines"}>Community guidelines</Link> for info about de do's and don'ts in using { BRAND }. { BRAND } video chat is AI moderated but no moderation is perfects. Users are solely responsible for their behaviour while using { BRAND }</p>
                        <p><strong>You must be 18 (or the legal majority in your jurisdiction) or older to use {BRAND}</strong>. See {BRAND} <Link className="btn-link" to={"policies/terms-and-conditions"}>Terms and conditions</Link> for more info. Parental control protections that may assists parents are commercially available and you can find more info at <a className="btn-link" href="https://www.connectsafely.org/controls" target="_blank" rel="noopener noreferrer" >https://www.connectsafely.org/controls</a> as well are other sites.</p>
                        <p>Please leave { BRAND } and visit an adult site instead if that's what you are looking for and you are 18 (or the legal majority in your jurisdiction) or older.</p>
                    </div>
                    <Alert 
                        title="Video is monitored"
                        text="Keep it clean and help by reporting NSFW behaviour"
                        icon={<AiFillWarning className="text-warning" />  }
                        color="primary"
                    />
                    {/* <Alert 
                        title="Your computer/network has been banned"
                        text="Due to bad behiavior. Don't worry, ban won't last forever."
                        icon={<FaBan className="text-error h-8 w-8 hidden sm:block" />  }
                        color=""
                    /> */}
                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex flex-col gap-3 items-center">
                            <h4>What do you want to talk about?</h4>
                            <InterestInput values={interests} onChange={setInterests} />
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <h3 className="text-lg font-bold">Start chatting</h3>
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto">
                                <button onClick={()=>dispatch({type: "MODE", payload: "text"})} className="btn btn-lg btn-primary w-full sm:w-40">Text</button>
                                <div className="divider sm:divider-horizontal">OR</div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={()=>dispatch({type: "MODE", payload: "video"})} className="btn btn-lg btn-primary w-full sm:w-40">Video</button>
                                    <button onClick={()=>dispatch({type: "MODE", payload: "unmoderated"})} className="btn btn-xs text-xs w-full sm:w-40 sm:self-end">Unmoderated section</button>
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