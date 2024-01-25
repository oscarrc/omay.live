import { createContext, useEffect, useMemo, useState } from "react";

const DeviceContext = createContext(null)

const DeviceProvider = ({ children }) => {
    const [device, setDevice] = useState('');
    const isMobile = useMemo(() => device !== 'Desktop', [device]);

    useEffect(() => {
        const handleDeviceDetection = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
            const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

            if (isMobile) {
                setDevice('Mobile');
            } else if (isTablet) {
                setDevice('Tablet');
            } else {
                setDevice('Desktop');
            }
            };

            handleDeviceDetection();
            window.addEventListener('resize', handleDeviceDetection);

            return () => {
                window.removeEventListener('resize', handleDeviceDetection);
            };
        }, []);

        return (
            <DeviceContext.Provider value={{ device, isMobile }}>
                { children }
            </DeviceContext.Provider>
        )
    }

const useDevice = () => {
    const context = useContext(DeviceContext);
    if(context === undefined) throw new Error("useDevice must be used within a DeviceProvider")
    return context;
}

export { DeviceProvider, useDevice }