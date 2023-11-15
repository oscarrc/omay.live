import { cloneElement } from "react";

const Alert = ({color, title, icon, text}) => {
    const colorClasses = {
        primary: "alert-primary bg-primary/75",
        secondary: "alert-secondary bg-secondary/75",
        accent: "alert-accent bg-accent/75",
        succes: "alert-success bg-success/75",
        info: "alert-info bg-info/75",
        warning: "alert-warning bg-warning/75",
        error:  "alert-error bg-error/75",
    }

    return (
        <div className={`alert items-center ${colorClasses[color]}`}>
            { 
                cloneElement(icon, {
                    className: `${icon.props.className} h-8 w-8 hidden sm:block`
                })
            }
            <div>
                <h2 className="font-bold">{title}</h2>
                <div className="text-xs">{text}</div>
            </div>                     
        </div>
    )
}

export default Alert;