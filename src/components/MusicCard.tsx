
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre?: string;
  previewUrl?: string;
  spotifyUri?: string;
}

interface MusicCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onGenerateStory?: (song: Song) => void;
}

export function MusicCard({ song, onPlay, onGenerateStory }: MusicCardProps) {
  return (
    <div className="music-card group relative rounded-lg overflow-hidden bg-background transition-all duration-200 hover:shadow-xl">
      <div className="w-full aspect-square relative">
        <img 
          src={song.cover} 
          alt={`${song.title} by ${song.artist}`}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="p-4 text-center">
            <h3 className="font-medium text-white truncate">{song.title}</h3>
            <p className="text-sm text-white/80 truncate">{song.artist}</p>
            
            <div className="flex gap-2 mt-3">
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
      
      <div className="p-3">
        <h3 className="font-medium truncate">{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  );
}
