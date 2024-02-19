import{ useMemo } from "react";

const Counter = ({ count }) => {
    const counter = useMemo(() => {
        let elements = [];
        let counter = count.toString().split("");
        console.log(counter)

        counter.forEach( (g,i) =>{
            elements.push(           
                <span className="countdown countdown-single text-xl md:text-2xl" key={i}>
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