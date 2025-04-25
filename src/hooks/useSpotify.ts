
import { useState } from 'react';
import { searchTracks, transformTrackToSong } from '@/integrations/spotify/spotify';
import { toast } from '@/hooks/use-toast';

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
      
      // Include both tracks with and without previews, since we can open them in Spotify
      setSearchResults(formattedTracks);
      setIsLoading(false);
      
      if (formattedTracks.length === 0) {
        toast({
          title: "No Tracks Found",
          description: "Try searching with different keywords",
          variant: "default"
        });
      }
      
      return formattedTracks;
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
