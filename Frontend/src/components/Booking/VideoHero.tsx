import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface VideoHeroProps {
  videoId?: string; // YouTube video ID (optional)
  videoSrc?: string; // Local video source (optional)
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  children?: React.ReactNode;
}

const VideoHero: React.FC<VideoHeroProps> = ({
  videoId,
  videoSrc,
  title,
  subtitle,
  ctaText,
  ctaLink,
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // For local videos, ensure they play continuously
    if (videoRef.current && videoSrc) {
      const video = videoRef.current;

      // Set video to play automatically
      video.play().catch(error => {
        console.error("Error playing video:", error);
      });

      // Check if video is paused and restart it
      const checkVideo = setInterval(() => {
        if (video.paused) {
          video.play().catch(error => {
            console.error("Error restarting video:", error);
          });
        }
      }, 2000);

      return () => clearInterval(checkVideo);
    }
  }, [videoSrc]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        {videoId ? (
          // YouTube Video  
          <div
            className="relative w-full h-full pt-[56.25%]" // 16:9 Aspect Ratio
            style={{
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              transform: 'scale(1.5)', // Slightly larger to cover any gaps
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=0&mute=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-0 left-0 w-full h-full border-0"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            />
          </div>
        ) : videoSrc ? (
          // Local Video
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ zIndex: 2 }}
      />

      {/* Content */}
      <div
        className="relative flex min-h-screen items-center justify-center"
        style={{ zIndex: 3 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            {subtitle}
          </p>
          {ctaText && ctaLink && (
            <Link
              ref={ctaLink}
              className="inline-block rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-primary/80" to={''}            >
              {ctaText}
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default VideoHero; 