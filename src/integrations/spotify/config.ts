
// Spotify API configuration
export const SPOTIFY_CLIENT_ID = "dd8b5d00327b4d4f802137f8c306fd53";

// The redirect URI for Spotify authentication callback
export const getRedirectUri = (): string => {
  return window.location.origin + '/callback';
};

// Scopes required for Spotify API access
export const SPOTIFY_SCOPES = [
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
