
'use client';

import { useLanguage } from '../../hooks/useLanguage';

function AboutUs() {
    const { t, isRTL, textDirection } = useLanguage();
    
    return (
        <div className="w-full h-screen bg-background flex justify-center items-center">
            <div className="translate-y-[10%] w-full grid grid-rows-1 grid-cols-1 justify-items-center">
                <div className={`row-start-1 col-start-1 z-10 max-w-[80%] w-[500px] flex flex-col items-center gap-y-[20px] ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: textDirection }}>
                    <p className="text-[50px] font-bold">{t('aboutUs.title')}</p>
                    <p className="text-[18px] text-center">{t('aboutUs.description')}</p>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;