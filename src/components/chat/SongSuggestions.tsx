
import { MusicCard } from '@/components/MusicCard';
import { Song } from './types';

interface SongSuggestionsProps {
  songs: any[];
  onPlay: (song: any) => void;
}

export function SongSuggestions({ songs, onPlay }: SongSuggestionsProps) {
  if (!songs || songs.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {songs.map(song => (
        <MusicCard 
          key={song.id} 
          song={song}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
