
import { useState } from 'react';
import { searchTracks, transformTrackToSong, initiateSpotifyAuth } from '@/integrations/spotify/spotify';
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
      console.log(`Searching for: ${query}`);
      const tracks = await searchTracks(query, limit);
      
      if (!tracks || tracks.length === 0) {
        console.log('No tracks found, using empty array');
        setSearchResults([]);
        setIsLoading(false);
        
        toast({
          title: "No Tracks Found",
          description: "Try searching with different keywords or connect to Spotify",
          variant: "destructive"
        });
        
        return [];
      }
      
      console.log(`Received ${tracks.length} tracks from search`);
      const formattedTracks = tracks.map(track => transformTrackToSong(track)).filter(Boolean);
      
      console.log(`Formatted ${formattedTracks.length} tracks`);
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
  
  const connectToSpotify = () => {
    toast({
      title: "Connecting to Spotify",
      description: "Redirecting to Spotify for authentication...",
      variant: "default"
    });
    initiateSpotifyAuth();
  };
  
  return {
    search,
    searchResults,
    isLoading,
    connectToSpotify
  };
}
