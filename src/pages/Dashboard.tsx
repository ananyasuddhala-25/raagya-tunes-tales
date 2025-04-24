
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicCard } from '@/components/MusicCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Navbar } from '@/components/Navbar';
import { ChatbotDialog } from '@/components/ChatbotDialog';
import { mockSongs, mockGenres } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const navigate = useNavigate();

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
  };

  const handleGoToStoryGenerator = (song: any) => {
    navigate(`/stories/${song.id}`);
  };

  const filteredSongs = mockSongs.filter(song => {
    // Filter by genre
    if (selectedGenre !== "All" && song.genre !== selectedGenre) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !song.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !song.artist.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar openChatbot={() => setIsChatbotOpen(true)} />
      
      <div className="container py-6 flex-1">
        {/* Search and filter bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs or artists..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2 max-w-full no-scrollbar">
            {mockGenres.map(genre => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className="whitespace-nowrap"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recommended">For You</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="space-y-4">
            <h2 className="text-2xl font-bold">Discover New Music</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {filteredSongs.map(song => (
                <MusicCard 
                  key={song.id}
                  song={song}
                  onPlay={handlePlaySong}
                  onGenerateStory={handleGoToStoryGenerator}
                />
              ))}
            </div>
            
            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No songs match your search criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            <h2 className="text-2xl font-bold">Popular Tracks</h2>
            <p className="text-muted-foreground mt-2">Most played songs this week</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {filteredSongs.slice(0, 6).map(song => (
                <MusicCard 
                  key={song.id}
                  song={song}
                  onPlay={handlePlaySong}
                  onGenerateStory={handleGoToStoryGenerator}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommended">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <p className="text-muted-foreground mt-2">Based on your listening habits</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {filteredSongs.slice(6).map(song => (
                <MusicCard 
                  key={song.id}
                  song={song}
                  onPlay={handlePlaySong}
                  onGenerateStory={handleGoToStoryGenerator}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <MusicPlayer song={currentSong} />
      <ChatbotDialog isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
