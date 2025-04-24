
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
}

interface MusicCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onGenerateStory?: (song: Song) => void;
}

export function MusicCard({ song, onPlay, onGenerateStory }: MusicCardProps) {
  return (
    <div className="music-card rounded-lg overflow-hidden">
      <img 
        src={song.cover} 
        alt={`${song.title} by ${song.artist}`}
        className="w-full aspect-square object-cover"
      />
      
      <div className="music-card-overlay">
        <div className="w-full">
          <h3 className="font-medium text-white truncate">{song.title}</h3>
          <p className="text-sm text-white/80 truncate">{song.artist}</p>
          
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => onPlay(song)}
            >
              <Play className="h-4 w-4 mr-1" /> Play
            </Button>
            
            {onGenerateStory && (
              <Button 
                size="sm"
                variant="outline"
                className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30"
                onClick={() => onGenerateStory(song)}
              >
                Story
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
