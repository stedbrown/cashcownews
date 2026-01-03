'use client';

import { useEffect } from 'react';

interface AdSenseUnitProps {
    client_id: string;
    slot_id: string;
    format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdSenseUnit({
    client_id,
    slot_id,
    format = 'auto',
    responsive = true,
    className = '',
}: AdSenseUnitProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense initialization error:', err);
        }
    }, []);

    return (
        <div className={`adsense-container overflow-hidden w-full my-8 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client_id}
                data-ad-slot={slot_id}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}
