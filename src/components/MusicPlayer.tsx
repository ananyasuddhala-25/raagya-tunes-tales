
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MusicPlayerProps {
  song?: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    previewUrl?: string;
    spotifyUri?: string;
  } | null;
}

export function MusicPlayer({ song }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interval = useRef<number | null>(null);
  
  // Initialize audio element once
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
      console.log('Loading song:', song.title);
      console.log('Preview URL:', song.previewUrl);
      
      setProgress(0);
      setIsPlaying(false);
      
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
      
      if (song.previewUrl) {
        audioRef.current.src = song.previewUrl;
        audioRef.current.load();
        console.log('Audio source set:', audioRef.current.src);
      } else {
        console.log('No preview URL available');
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
  
  // Open song in Spotify
  const openSpotifyTrack = () => {
    if (song?.spotifyUri) {
      window.open(song.spotifyUri, '_blank');
      toast({
        title: "Opening Spotify",
        description: "Listen to the full song on Spotify",
        variant: "default"
      });
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!song) {
      toast({
        title: "No Song Selected",
        description: "Please select a song to play",
        variant: "destructive"
      });
      return;
    }
    
    if (!song.previewUrl && song.spotifyUri) {
      openSpotifyTrack();
      return;
    }
    
    if (isPlaying) {
      console.log('Pausing audio');
      audioRef.current?.pause();
    } else {
      if (audioRef.current && song.previewUrl) {
        console.log('Playing audio');
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
  
  // Handle progress bar changes
  const handleProgressChange = ([value]: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render component
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
                <Button variant="ghost" size="icon" disabled>
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
                
                <Button variant="ghost" size="icon" disabled>
                  <SkipForward className="h-4 w-4" />
                </Button>

                {song.spotifyUri && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openSpotifyTrack}
                    className="text-green-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
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
      
      {song && !song.previewUrl && song.spotifyUri && (
        <div className="text-xs text-muted-foreground text-center pb-1">
          No preview available. Click the external link to open on Spotify.
        </div>
      )}
    </div>
  );
}
