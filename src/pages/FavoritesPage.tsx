
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ChatbotDialog } from '@/components/ChatbotDialog';
import { MusicPlayer } from '@/components/MusicPlayer';
import { mockSongs } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicCard } from '@/components/MusicCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  // In a real app, we would fetch the user's favorite songs from the database
  // For now, we'll just use a few songs from the mock data
  const favoriteSongs = mockSongs.slice(0, 4);
  const favoriteStories = mockSongs.slice(4, 7);
  
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
  };

  const handleGoToStoryGenerator = (song: any) => {
    navigate(`/stories/${song.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar openChatbot={() => setIsChatbotOpen(true)} />
      
      <div className="container py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Favorites</h1>
        </div>
        
        <Tabs defaultValue="songs">
          <TabsList className="mb-6">
            <TabsTrigger value="songs">Favorite Songs</TabsTrigger>
            <TabsTrigger value="stories">Favorite Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="songs" className="space-y-6">
            {favoriteSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteSongs.map(song => (
                  <MusicCard 
                    key={song.id}
                    song={song}
                    onPlay={handlePlaySong}
                    onGenerateStory={handleGoToStoryGenerator}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed rounded-lg">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No favorite songs yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and adding songs to your favorites
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Discover Music
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stories" className="space-y-6">
            {favoriteStories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteStories.map(song => (
                  <MusicCard 
                    key={song.id}
                    song={song}
                    onPlay={handlePlaySong}
                    onGenerateStory={handleGoToStoryGenerator}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed rounded-lg">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No favorite stories yet</h3>
                <p className="text-muted-foreground mb-6">
                  Generate stories from your favorite songs and save them here
                </p>
                <Button onClick={() => navigate('/stories')}>
                  Story Engine
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <MusicPlayer song={currentSong} />
      <ChatbotDialog isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
