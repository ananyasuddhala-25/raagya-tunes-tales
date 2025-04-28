
// Helper to transform Spotify track data to our app format
export const transformTrackToSong = (track: SpotifyApi.TrackObjectFull) => {
  if (!track) {
    console.error('Attempted to transform undefined track');
    return null;
  }
  
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
