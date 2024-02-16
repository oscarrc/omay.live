import { cloneElement } from "react";

const Alert = ({color, title, icon, text}) => {
    const colorClasses = {
        primary: "alert-primary bg-primary/75 text-primary-content",
        secondary: "alert-secondary bg-secondary/75 text-secondary-content",
        accent: "alert-accent bg-accent/75 text-accent-content",
        succes: "alert-success bg-success/75 text-success-content",
        info: "alert-info bg-info/75 text-info-content",
        warning: "alert-warning bg-warning/75 text-warning-content",
        error:  "alert-error bg-error/75 text-error-content",
    }

    return (
        <div className={`alert items-center ${colorClasses[color]}`}>
            { 
                cloneElement(icon, {
                    className: `${icon.props.className} h-8 w-8 hidden sm:block`
                })
            }
            <div className="rtl:sm:text-right">
                <h3 className="font-bold">{title}</h3>
                <div className="text-xs">{text}</div>
            </div>                     
        </div>
    )
}

export default Alert;