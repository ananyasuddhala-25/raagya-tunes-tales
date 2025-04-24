
import { useState } from 'react';
import { searchTracks, transformTrackToSong } from '@/integrations/spotify/spotify';
import { toast } from '@/components/ui/use-toast';

export function useSpotify() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const search = async (query: string, limit: number = 20) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }
    
    setIsLoading(true);
    try {
      const tracks = await searchTracks(query, limit);
      const formattedTracks = tracks.map(track => transformTrackToSong(track));
      
      // Only set results with preview URLs or Spotify URI
      const playableTracks = formattedTracks.filter(track => 
        track.previewUrl || track.spotifyUri
      );
      
      setSearchResults(playableTracks);
      setIsLoading(false);
      
      if (playableTracks.length === 0) {
        toast({
          title: "No Playable Tracks",
          description: "No tracks with preview or Spotify link found.",
          variant: "default"
        });
      }
      
      return playableTracks;
    } catch (error) {
      console.error('Failed to search tracks:', error);
      toast({
        title: "Search Failed",
        description: "Could not complete your search. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
      return [];
    }
  };
  
  return {
    search,
    searchResults,
    isLoading
  };
}
