
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MusicPlayerProps {
  song?: {
    id: string;
    title: string;
    artist: string;
    cover: string;
  } | null;
}

export function MusicPlayer({ song }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // In a real app, we'd use the actual audio file
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interval = useRef<number | null>(null);
  
  // In a real app with Spotify API, this would be where we load the actual song
  useEffect(() => {
    if (song) {
      setProgress(0);
      setDuration(180); // Mock 3 minutes duration
      setIsPlaying(false);
      
      // Clear any existing interval
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
    }
  }, [song]);
  
  const togglePlayPause = () => {
    if (!song) return;
    
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start progress interval
      interval.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            window.clearInterval(interval.current!);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Clear interval
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
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
                
                <div className="flex-1 progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(progress / duration) * 100}%` }}
                  ></div>
                </div>
                
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
