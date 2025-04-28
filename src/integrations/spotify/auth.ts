
import { supabase } from '@/integrations/supabase/client';
import spotifyApi from './api/client';
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, getRedirectUri } from './config';

// Function to initiate Spotify authentication
export const initiateSpotifyAuth = (): void => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(getRedirectUri())}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(' '))}`;
  
  window.location.href = authUrl;
};

// Check if user is connected to Spotify
export const isConnectedToSpotify = async (): Promise<boolean> => {
  const token = await getStoredToken();
  return !!token;
};

// Get access token from Supabase edge function
export const getAccessToken = async (authCode?: string): Promise<string | null> => {
  try {
    console.log("Getting Spotify access token");
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
export const getStoredToken = async (): Promise<string | null> => {
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
