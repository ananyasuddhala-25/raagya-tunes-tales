
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
      spotifyApi.setAccessToken(data.access_token);
      return data.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Spotify token:', error);
    return null;
  }
};

// Search tracks on Spotify
export const searchTracks = async (query: string) => {
  try {
    await getAccessToken();
    const response = await spotifyApi.searchTracks(query, { limit: 10 });
    return response.tracks?.items || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

// Get track details by Spotify ID
export const getTrack = async (trackId: string) => {
  try {
    await getAccessToken();
    return await spotifyApi.getTrack(trackId);
  } catch (error) {
    console.error('Error getting track:', error);
    return null;
  }
};

// Get audio features for a track
export const getAudioFeatures = async (trackId: string) => {
  try {
    await getAccessToken();
    return await spotifyApi.getAudioFeaturesForTrack(trackId);
  } catch (error) {
    console.error('Error getting audio features:', error);
    return null;
  }
};

// Helper to transform Spotify track data to our app format
export const transformTrackToSong = (track: SpotifyApi.TrackObjectFull) => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    cover: track.album.images[0]?.url || '/placeholder.svg',
    previewUrl: track.preview_url,
    genre: '', // Spotify doesn't provide genre at the track level
    duration: track.duration_ms / 1000, // Convert ms to seconds
    spotifyUri: track.uri
  };
};
