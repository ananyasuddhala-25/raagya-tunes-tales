
import spotifyApi from './api/client';
import { getStoredToken, getAccessToken } from './auth';

// Enhanced track searching with full track details
export const searchTracks = async (query: string, limit: number = 20) => {
  try {
    console.log(`Starting search for: "${query}"`);
    
    // Try to use stored token first
    let token = await getStoredToken();
    
    // If no stored token, get a new one
    if (!token) {
      console.log("No stored token, getting new one");
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
    
    // Return the tracks directly without fetching additional details
    console.log(`Returning ${response.tracks?.items.length || 0} tracks`);
    
    return response.tracks?.items || [];
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
