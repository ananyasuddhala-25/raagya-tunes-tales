
import { Slider } from '@/components/ui/slider';
import { PlayerControls } from '@/components/player/PlayerControls';
import { VolumeControl } from '@/components/player/VolumeControl';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { formatTime } from '@/utils/formatTime';
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
  const { 
    isPlaying, 
    progress, 
    duration, 
    volume, 
    setVolume, 
    togglePlayPause, 
    setProgress 
  } = useAudioPlayer({ song });
  
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

  const handleProgressChange = ([value]: number[]) => {
    setProgress(value);
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
              <PlayerControls 
                isPlaying={isPlaying}
                onPlayPause={togglePlayPause}
                onOpenSpotify={openSpotifyTrack}
                spotifyUri={song.spotifyUri}
              />
              
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
            
            <VolumeControl 
              volume={volume}
              onVolumeChange={setVolume}
            />
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

