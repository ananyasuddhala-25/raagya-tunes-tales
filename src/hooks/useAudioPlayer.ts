
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface AudioPlayerHookProps {
  song?: {
    previewUrl?: string;
    title: string;
  } | null;
}

export function useAudioPlayer({ song }: AudioPlayerHookProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interval = useRef<number | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        toast({
          title: "Preview Ended",
          description: "Open in Spotify to listen to the full song",
          variant: "default"
        });
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current ? audioRef.current.duration : 0);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Playback Error",
          description: "Could not play preview. Try opening in Spotify.",
          variant: "destructive"
        });
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('playing', () => {
        console.log('Audio started playing');
        toast({
          title: "Playing Preview",
          description: "This is a 30-second preview. Open in Spotify for the full song.",
          variant: "default"
        });
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    };
  }, []);
  
  // Handle song changes
  useEffect(() => {
    if (song && audioRef.current) {
      setProgress(0);
      setIsPlaying(false);
      
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
      
      if (song.previewUrl) {
        audioRef.current.src = song.previewUrl;
        audioRef.current.load();
      } else {
        toast({
          title: "Preview Unavailable",
          description: "This track doesn't have a preview available.",
          variant: "destructive"
        });
      }
    }
  }, [song]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      interval.current = window.setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 1000);
    } else {
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
    }
    
    return () => {
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!song) {
      toast({
        title: "No Song Selected",
        description: "Please select a song to play",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      if (audioRef.current && song.previewUrl) {
        audioRef.current.play()
          .catch(error => {
            console.error("Playback error:", error);
            toast({
              title: "Playback Error",
              description: "Could not play preview. Try opening in Spotify.",
              variant: "destructive"
            });
          });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    togglePlayPause,
    setProgress
  };
}

