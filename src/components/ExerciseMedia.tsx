import { useState } from 'react';
import { Barbell } from '@phosphor-icons/react';

interface ExerciseMediaProps {
    gifUrl?: string;
    videoUrl?: string;
    alt: string;
    color?: string;
    className?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
}

export function ExerciseMedia({
    gifUrl,
    videoUrl: propVideoUrl,
    alt,
    color = '#0A84FF',
    className = 'w-full h-full object-cover',
    objectFit = 'cover'
}: ExerciseMediaProps) {
    const [videoFailed, setVideoFailed] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    // Smart detection: move .mp4 from gifUrl to video part if needed
    let videoUrl = propVideoUrl;
    let actualGifUrl = gifUrl;

    if (gifUrl?.toLowerCase().endsWith('.mp4')) {
        videoUrl = gifUrl;
        actualGifUrl = undefined;
    }

    // Try Video first
    if (videoUrl && !videoFailed) {
        return (
            <video
                src={videoUrl}
                className={className}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoFailed(true)}
                style={{ objectFit }}
            />
        );
    }

    // Try GIF/Image if no video or video failed
    if (actualGifUrl && !imageFailed) {
        return (
            <img
                src={actualGifUrl}
                alt={alt}
                className={className}
                onError={() => setImageFailed(true)}
                style={{ objectFit }}
            />
        );
    }

    // Ultimate fallback: Barbell icon with themed background
    return (
        <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}15` }}>
            <Barbell size={28} weight="duotone" style={{ color: `${color}90` }} />
        </div>
    );
}

