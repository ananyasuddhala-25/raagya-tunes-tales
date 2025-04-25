
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, ExternalLink } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onOpenSpotify?: () => void;
  spotifyUri?: string;
}

export function PlayerControls({ 
  isPlaying, 
  onPlayPause, 
  onOpenSpotify, 
  spotifyUri 
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" disabled>
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      
      <Button variant="ghost" size="icon" disabled>
        <SkipForward className="h-4 w-4" />
      </Button>

      {spotifyUri && onOpenSpotify && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSpotify}
          className="text-green-600"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

