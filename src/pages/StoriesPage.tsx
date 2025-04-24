
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ChatbotDialog } from '@/components/ChatbotDialog';
import { StoryGenerator } from '@/components/StoryGenerator';
import { MusicPlayer } from '@/components/MusicPlayer';
import { mockSongs } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MusicCard } from '@/components/MusicCard';

export default function StoriesPage() {
  const { songId } = useParams<{ songId: string }>();
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (songId) {
      const song = mockSongs.find(s => s.id === songId);
      if (song) {
        setSelectedSong(song);
      }
    }
  }, [songId]);

  const handleSelectSong = (song: any) => {
    setSelectedSong(song);
    navigate(`/stories/${song.id}`);
  };

  const filteredSongs = mockSongs.filter(song => {
    if (!searchTerm) return true;
    
    return song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
           song.genre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar openChatbot={() => setIsChatbotOpen(true)} />
      
      <div className="container py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Song selection sidebar */}
        <div className="md:w-1/3 lg:w-1/4 space-y-4">
          <h2 className="text-xl font-bold">Choose a Song</h2>
          <p className="text-sm text-muted-foreground">Select a song to generate a unique story</p>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Find a song..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2">
            {filteredSongs.map(song => (
              <MusicCard 
                key={song.id}
                song={song}
                onPlay={(song) => handleSelectSong(song)}
              />
            ))}
          </div>
        </div>
        
        {/* Story area */}
        <div className="md:w-2/3 lg:w-3/4">
          {selectedSong ? (
            <StoryGenerator song={selectedSong} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-lg border border-dashed">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-medium mb-2">No Song Selected</h3>
              <p className="text-muted-foreground">
                Choose a song from the list to generate a unique story inspired by its melody and genre
              </p>
            </div>
          )}
        </div>
      </div>
      
      {selectedSong && <MusicPlayer song={selectedSong} />}
      <ChatbotDialog isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
