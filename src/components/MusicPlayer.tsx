
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MusicPlayerProps {
  song?: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    previewUrl?: string;
  } | null;
}

export function MusicPlayer({ song }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interval = useRef<number | null>(null);
  
  // Set up audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set initial volume
      audioRef.current.volume = volume / 100;
      
      // Add event listeners
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current ? audioRef.current.duration : 0);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Playback Error",
          description: "This track preview is unavailable. Please try another song.",
          variant: "destructive"
        });
        setIsPlaying(false);
      });
    }
    
    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    };
  }, []);
  
  // Update audio source when song changes
  useEffect(() => {
    if (song && audioRef.current) {
      // Reset player state
      setProgress(0);
      setIsPlaying(false);
      
      // Clear any existing interval
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
      
      // Set the new audio source if available
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
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Update progress while playing
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
    if (!song || !audioRef.current || !song.previewUrl) {
      toast({
        title: "Cannot Play",
        description: "No playable track selected.",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error("Playback error:", error);
          toast({
            title: "Playback Error",
            description: "Could not play this track. Please try again later.",
            variant: "destructive"
          });
        });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = ([value]: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-30">
      <div className="container flex items-center py-2">
        {song ? (
          <>
            <div className="flex items-center gap-3 w-1/4">
              <img 
                src={song.cover || '/placeholder.svg'} 
                alt={song.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="hidden sm:block">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="w-full flex items-center gap-2 px-4">
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {formatTime(progress)}
                </span>
                
                <Slider
                  value={[progress]}
                  min={0}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="flex-1"
                />
                
                <span className="text-xs text-muted-foreground w-8">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
            
            <div className="w-1/4 flex justify-end items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value)}
                className="w-24"
              />
            </div>
          </>
        ) : (
          <div className="w-full py-3 text-center text-muted-foreground">
            Select a song to start playing
          </div>
        )}
      </div>
    </div>
  );
}
