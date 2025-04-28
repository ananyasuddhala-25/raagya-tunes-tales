
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  songSuggestions?: any[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  genre?: string;
  duration?: number;
  spotifyUri?: string;
}
