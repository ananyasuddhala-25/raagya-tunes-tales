
import SpotifyWebApi from 'spotify-web-api-js';
import { supabase } from '@/integrations/supabase/client';

const spotifyApi = new SpotifyWebApi();
const SPOTIFY_CLIENT_ID = "dd8b5d00327b4d4f802137f8c306fd53";

// Fetch Spotify access token from Supabase edge function
export const getAccessToken = async (authCode?: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-spotify-token', {
      body: { authCode }
    });
    
    if (error) {
      console.error('Error getting Spotify token:', error);
      return null;
    }
    
    if (data && data.access_token) {
      console.log('Got Spotify access token');
      spotifyApi.setAccessToken(data.access_token);
      
      // Store the token in local storage for persistence
      if (data.expires_in) {
        const expiresAt = new Date().getTime() + (data.expires_in * 1000);
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_token_expires', expiresAt.toString());
        
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
      }
      
      return data.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Spotify token:', error);
    return null;
  }
};

// Check if token is stored and still valid
const getStoredToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('spotify_token');
  const expiresAtStr = localStorage.getItem('spotify_token_expires');
  
  if (token && expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr);
    
    // If token is expired, try to refresh it
    if (expiresAt <= new Date().getTime()) {
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      
      if (refreshToken) {
        try {
          const { data, error } = await supabase.functions.invoke('get-spotify-token', {
            body: { refreshToken }
          });
          
          if (!error && data && data.access_token) {
            return data.access_token;
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
        
        // Clear invalid tokens
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_expires');
        localStorage.removeItem('spotify_refresh_token');
        return null;
      }
    }
    
    return token;
  }
  
  return null;
};

// Function to initiate Spotify authentication
export const initiateSpotifyAuth = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  
  // Update with your app's actual URL
  const redirectUri = window.location.origin + '/callback';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`;
  
  window.location.href = authUrl;
};

// Check if user is connected to Spotify
export const isConnectedToSpotify = async (): Promise<boolean> => {
  const token = await getStoredToken();
  return !!token;
};

// Enhanced track searching with full track details
export const searchTracks = async (query: string, limit: number = 20) => {
  try {
    // Try to use stored token first
    let token = await getStoredToken();
    
    // If no stored token, get a new one
    if (!token) {
      token = await getAccessToken();
    }
    
    if (!token) {
      console.error('No Spotify token available');
      return [];
    }
    
    spotifyApi.setAccessToken(token);
    console.log(`Searching for: "${query}" with limit ${limit}`);
    
    const response = await spotifyApi.searchTracks(query, { 
      limit,
      market: 'IN',
    });
    
    console.log(`Found ${response.tracks?.items.length || 0} tracks in search`);
    
    // Get full track details
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
    // Try to use stored token first
    let token = await getStoredToken();
    
    // If no stored token, get a new one
    if (!token) {
      token = await getAccessToken();
    }
    
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    
    const track = await spotifyApi.getTrack(trackId);
    return track;
  } catch (error) {
    console.error(`Error getting track ${trackId}:`, error);
    return null;
  }
};

// Get recommendations based on tracks, artists, or genres
export const getRecommendations = async (params: {
  seed_tracks?: string[],
  seed_artists?: string[],
  seed_genres?: string[],
  limit?: number
}) => {
  try {
    // Try to use stored token first
    let token = await getStoredToken();
    
    // If no stored token, get a new one
    if (!token) {
      token = await getAccessToken();
    }
    
    if (!token) {
      console.error('No Spotify token available');
      return [];
    }
    
    spotifyApi.setAccessToken(token);
    
    const recommendations = await spotifyApi.getRecommendations({
      limit: params.limit || 20,
      seed_tracks: params.seed_tracks || [],
      seed_artists: params.seed_artists || [],
      seed_genres: params.seed_genres || []
    });
    
    return recommendations.tracks || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
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
    genre: track.artists[0]?.name || '',
    duration: track.duration_ms / 1000,
    spotifyUri: track.uri
  };
  
  console.log(`Transformed track: ${song.title} by ${song.artist}`);
  return song;
};
