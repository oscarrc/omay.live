import { useEffect, useMemo, useState } from 'react';

const useDeviceDetection = () => {
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

  return {device, isMobile};
};

export default useDeviceDetection;