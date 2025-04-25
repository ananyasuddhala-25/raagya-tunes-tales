
import SpotifyWebApi from 'spotify-web-api-js';
import { supabase } from '@/integrations/supabase/client';

const spotifyApi = new SpotifyWebApi();

// Fetch Spotify access token from Supabase edge function
const getAccessToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-spotify-token', {});
    
    if (error) {
      console.error('Error getting Spotify token:', error);
      return null;
    }
    
    if (data && data.access_token) {
      console.log('Got Spotify access token');
      spotifyApi.setAccessToken(data.access_token);
      return data.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Spotify token:', error);
    return null;
  }
};

// Enhanced track searching with full track details
export const searchTracks = async (query: string, limit: number = 20) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.error('No Spotify token available');
      return [];
    }
    
    console.log(`Searching for: "${query}" with limit ${limit}`);
    
    // Enhanced search to include market and popularity parameters
    const response = await spotifyApi.searchTracks(query, { 
      limit,
      market: 'IN', // Include Indian market
      // Add multiple search terms for better Indian music results
      q: `${query} OR language:hindi OR language:telugu`
    });
    
    console.log(`Found ${response.tracks?.items.length || 0} tracks in search`);
    
    // Get full track details to ensure we have preview URLs
    const trackIds = response.tracks?.items.map(track => track.id) || [];
    const fullTracksDetails = await Promise.all(
      trackIds.map(id => getTrack(id))
    );
    
    const validTracks = fullTracksDetails.filter(track => track !== null);
    console.log(`Returning ${validTracks.length} valid tracks`);
    
    return validTracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

// Get track details by Spotify ID with error handling
export const getTrack = async (trackId: string) => {
  try {
    await getAccessToken();
    const track = await spotifyApi.getTrack(trackId);
    return track;
  } catch (error) {
    console.error(`Error getting track ${trackId}:`, error);
    return null;
  }
};

// Helper to transform Spotify track data to our app format
export const transformTrackToSong = (track: SpotifyApi.TrackObjectFull) => {
  const song = {
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    cover: track.album.images[0]?.url || '/placeholder.svg',
    previewUrl: track.preview_url || '',
    genre: track.artists[0]?.name || '', // Fallback genre
    duration: track.duration_ms / 1000, // Convert ms to seconds
    spotifyUri: track.uri
  };
  
  console.log(`Transformed track: ${song.title} by ${song.artist}, preview: ${song.previewUrl ? 'Available' : 'Not available'}`);
  return song;
};
