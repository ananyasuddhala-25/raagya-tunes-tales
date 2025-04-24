
import { useState } from 'react';
import { searchTracks, transformTrackToSong } from '@/integrations/spotify/spotify';
import { toast } from '@/components/ui/use-toast';

export function useSpotify() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }
    
    setIsLoading(true);
    try {
      const tracks = await searchTracks(query);
      const formattedTracks = tracks.map(track => transformTrackToSong(track));
      
      setSearchResults(formattedTracks);
      setIsLoading(false);
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
