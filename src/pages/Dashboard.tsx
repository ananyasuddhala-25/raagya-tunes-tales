
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicCard } from '@/components/MusicCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Navbar } from '@/components/Navbar';
import { ChatbotDialog } from '@/components/ChatbotDialog';
import { mockSongs, mockGenres } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { search, searchResults, isLoading } = useSpotify();
  
  const navigate = useNavigate();
  
  // Initial Spotify search for popular songs
  useEffect(() => {
    // Search for popular Indian songs on initial load
    search("popular hits hindi telugu");
  }, []);
  
  // Search with debounce
  useEffect(() => {
    const debounceId = setTimeout(() => {
      if (searchTerm) {
        console.log('Searching for:', searchTerm);
        search(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(debounceId);
  }, [searchTerm, search]);

  const handlePlaySong = (song: any) => {
    console.log('Playing song:', song.title);
    console.log('Preview URL:', song.previewUrl);
    setCurrentSong(song);
  };

  const handleGoToStoryGenerator = (song: any) => {
    navigate(`/stories/${song.id}`);
  };

  // Use search results if we have them, otherwise fall back to filtered mock data
  const displaySongs = searchResults.length > 0 ? searchResults : 
    mockSongs.filter(song => {
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
              placeholder="Search Spotify..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
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
              {displaySongs.map(song => (
                <MusicCard 
                  key={song.id}
                  song={song}
                  onPlay={handlePlaySong}
                  onGenerateStory={handleGoToStoryGenerator}
                />
              ))}
            </div>
            
            {displaySongs.length === 0 && searchTerm && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No songs match your search criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            <h2 className="text-2xl font-bold">Popular Tracks</h2>
            <p className="text-muted-foreground mt-2">Most played songs this week</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {displaySongs.slice(0, 6).map(song => (
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
              {displaySongs.slice(6).map(song => (
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
