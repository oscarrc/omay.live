import { useEffect, useMemo, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");;
    const isDark = useMemo(() => theme === "dark", [theme]);
    
    const toggleTheme = () => {
        setTheme( t => t === "dark" ? "light" : "dark")
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.dataset.theme = theme;
    }, [theme])

    return {
        theme,
        toggleTheme,
        isDark
    }
}

export default useTheme;