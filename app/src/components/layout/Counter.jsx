import{ useMemo } from "react";

const Counter = ({ count }) => {
    const counter = useMemo(() => {
        let elements = [];
        let counter = count.toString().match(/..?/g)

        counter.forEach( (g,i) =>{
            let c = counter.length % 2 !== 0 && i === counter.length - 1 ? "-mr-3" : "";

            elements.push(           
                <span className={`countdown text-xl md:text-2xl ${c}`} key={i}>
                    <span style={{"--value":g}}></span>            
                </span>
            )
        })
        
        return elements;
    }, [count]);

    return (
        <div className="whitespace-nowrap text-primary text-lg font-bold hidden sm:inline">
            { counter }
            <span className="text-2xl">+</span> Online now
        </div>
    )
}

export default Counter;