import { IoMdClose } from "react-icons/io";
import { useQuery } from "react-query";
import { useState } from "react";

const AdAlt = ({ zoneId, className, children }) => {
    const [show, setShow] = useState(false);

    const {data: adData} = useQuery({
        queryKey: ["ad", zoneId],
        queryFn: async () => {
            let res = await fetch(`${import.meta.env.VITE_SERVER_URL}/ad?zoneId=${zoneId}`, { method: "GET"})
            let data = await res.json();
            return data?.zones[0] || false
        },    
        refetchInterval: (adData) => {
            if(!adData) return 0;
            if(!adData.data?.frequency_period) return 0;
            return parseInt(adData.data.frequency_period) * 1000;
        },
        onSuccess: () => setShow(true),
        onError: () => setShow(false),
        initialData: false
    })
    
    const adPositon = {
        top: "top-0",
        right: "right-0",
        bottom: "bottom-0",
        left: "left-0"
    }

    if(!adData) return <>{children}</>

    return (
        <div 
            className={`
                ad relative flex
                ${adData.data?.v_pos ? adPositon[adData.data.v_pos] : ""} 
                ${adData.data?.h_pos ? adPositon[adData.data.h_pos] : ""} 
                ${className}
        `}>
            {
                show &&
                    <>
                        {
                            adData.data?.frequency_period &&
                            <button onClick={ () => setShow(false) } className="absolute top-1 right-1 btn btn-circle btn-xs btn-neutral">
                                <IoMdClose className="h-2 w-2" />
                            </button>
                        }
                        <div role="button" aria-label="ad" className="cursor-pointer" onClick={()=>window.open(adData.data.url,'_blank', 'rel=noopener noreferrer')}>
                            <img src={adData.data.image} width={adData.data.width} height={adData.data.height} alt="banner" />
                        </div>
                    </>
            }
        </div>
    )
}

export default AdAlt;