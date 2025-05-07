import React, { useRef, useEffect, useState } from 'react';
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
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferedPercentage, setBufferedPercentage] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      const video = videoRef.current;

      // Implement video caching
      const cacheVideo = async () => {
        try {
          // Check if video is already in cache
          const cache = await caches.open('video-cache');
          const cachedResponse = await cache.match(videoSrc);

          if (cachedResponse) {
            // Use cached video
            const blob = await cachedResponse.blob();
            const url = URL.createObjectURL(blob);
            video.src = url;
            setIsVideoLoaded(true);
          } else {
            // Fetch and cache video
            const response = await fetch(videoSrc);
            await cache.put(videoSrc, response.clone());
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            video.src = url;
            setIsVideoLoaded(true);
          }
        } catch (error) {
          console.error('Error caching video:', error);
          // Fallback to direct video source if caching fails
          video.src = videoSrc;
          setIsVideoLoaded(true);
        }
      };

      cacheVideo();

      // Set video to play automatically once loaded
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      // Handle buffering
      const handleProgress = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const duration = video.duration;
          const percentage = (bufferedEnd / duration) * 100;
          setBufferedPercentage(percentage);
        }
      };

      const handleWaiting = () => setIsBuffering(true);
      const handlePlaying = () => setIsBuffering(false);
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        playVideo();
      };

      // Add event listeners
      video.addEventListener('progress', handleProgress);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('loadeddata', handleLoadedData);

      // Check if video is paused and restart it
      const checkVideo = setInterval(() => {
        if (video.paused && !isBuffering && isVideoLoaded) {
          playVideo();
        }
      }, 2000);

      return () => {
        clearInterval(checkVideo);
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('loadeddata', handleLoadedData);
        // Cleanup object URL
        if (video.src.startsWith('blob:')) {
          URL.revokeObjectURL(video.src);
        }
      };
    }
  }, [videoSrc, isBuffering, isVideoLoaded]);

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
          // Local Video with buffering indicator
          <div className="relative w-full h-full">
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
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-lg">Loading video...</div>
              </div>
            )}
            {/* Buffering progress bar */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-white/30 w-full"
              style={{ display: bufferedPercentage < 100 ? 'block' : 'none' }}
            >
              <div
                className="h-full bg-white/70 transition-all duration-300"
                style={{ width: `${bufferedPercentage}%` }}
              />
            </div>
          </div>
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
              to={ctaLink}
              className="inline-block rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-primary/80"
            >
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