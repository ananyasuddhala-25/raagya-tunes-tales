
import { useState, useEffect, useRef } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpotify } from '@/hooks/useSpotify';
import { MusicCard } from '@/components/MusicCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  songSuggestions?: any[];
}

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      text: "Hi there! I'm Raagya's AI music assistant. Tell me what kind of music you're in the mood for, and I'll suggest some songs!", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { search, searchResults, isLoading, connectToSpotify } = useSpotify();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Search for songs based on user input
    try {
      console.log("Searching for songs with query:", input);
      const results = await search(input, 5);
      console.log("Search results:", results);
      
      setTimeout(() => {
        // Create bot response with song suggestions
        const botResponses = [
          `Based on your request for "${input}", here are some songs you might enjoy:`,
          `I found some great tracks that match your taste for "${input}":`,
          `Here are some recommendations for "${input}" that I think you'll love:`,
          `For someone interested in "${input}", I'd suggest these songs:`,
          `Looking for "${input}"? Check out these tracks:`
        ];
        
        let botMessage: ChatMessage;
        
        if (results && results.length > 0) {
          botMessage = {
            id: (Date.now() + 1).toString(),
            text: botResponses[Math.floor(Math.random() * botResponses.length)],
            sender: 'bot',
            timestamp: new Date(),
            songSuggestions: results
          };
        } else {
          botMessage = {
            id: (Date.now() + 1).toString(),
            text: "I couldn't find any songs matching your request. Try connecting to Spotify or try a different search term.",
            sender: 'bot',
            timestamp: new Date()
          };
          
          toast({
            title: "No songs found",
            description: "Try connecting to Spotify for better results or try a different search term.",
            variant: "default"
          });
        }
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error searching for songs:', error);
      
      // Error response
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble finding songs right now. Please try again later or connect to Spotify for better recommendations.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        toast({
          title: "Search Failed",
          description: "Failed to search for songs. Please connect to Spotify.",
          variant: "destructive"
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePlaySong = (song: any) => {
    console.log("Playing song in chatbot:", song);
    setCurrentSong(song);
    
    if (!song.previewUrl) {
      toast({
        title: "No Preview Available",
        description: "This song doesn't have a preview. Connect to Spotify to listen to the full track.",
        variant: "default"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Music Assistant</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={connectToSpotify}
              className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700"
            >
              Connect to Spotify
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[500px]">
          <ScrollArea className="flex-1 pr-4">
            <div className="flex flex-col gap-3 py-4">
              {messages.map(msg => (
                <div key={msg.id} className="flex flex-col gap-2">
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                    {msg.text}
                  </div>
                  
                  {msg.songSuggestions && msg.songSuggestions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {msg.songSuggestions.map(song => (
                        <MusicCard 
                          key={song.id} 
                          song={song}
                          onPlay={handlePlaySong}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble chat-bubble-bot flex gap-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-100">•</span>
                  <span className="animate-pulse delay-200">•</span>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-center my-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0 mt-4">
            <div className="flex w-full gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for music recommendations..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isTyping || isLoading}>Send</Button>
            </div>
          </DialogFooter>
        </div>
        
        {currentSong && (
          <div className="mt-4 pt-4 border-t">
            <MusicPlayer song={currentSong} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
